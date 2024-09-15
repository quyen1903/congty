import crypto from 'node:crypto';
import { LoginDTO,RegisterDTO } from '../dto/user.dto';
import { validate, ValidationError } from 'class-validator';
import User from '../models/user.model';
import { BadRequestError, ForbiddenError, AuthFailureError } from "../core/error.response";
import KeyTokenService from './keyToken.service';
import { createTokenPair, IdecodeUser } from '../auth/authUtils';
import { IKeyToken,  } from '../models/keytoken.model';
import { Types } from 'mongoose';
import { getInfoData } from '../utils/utils';

class AccessService{
    private static generateKeyPair(){
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
            modulusLength:4096,
            publicKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            },
            privateKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            }
        })
        return {publicKey, privateKey}
    }

    //when resolve, value of type will be string
    private static hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    private static logger(errors: ValidationError[]){
        errors.forEach((error)=>{
            console.log(`Property: ${error.property}`);
            if(error.constraints){
                Object.keys(error.constraints).forEach((key)=>{
                    console.log(`- ${error.constraints![key]}`);
                    throw new BadRequestError(`- ${error.constraints![key]}`)
                })
            }
        })
    }

    private static async findUser( email: string ){
        return await User.findOne({email}).select( {email:1, password:1, salt:1}).lean()
    };

    static handleRefreshToken = async( keyStore: IKeyToken, user: IdecodeUser, refreshToken: string )=>{
        /**
         * 1 check wheather user's token been used or not, if been used, remove key and for them to relogin
         * 2 if user's token is not valid token, force them to relogin, too
         * 3 if this accesstoken is valid, create new accesstoken, refreshtoken
         * 4 update keytoken in database
        */

        //1
        const {userId, email} = user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happended, please relogin')
        }

        //2
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundUser = await this.findUser(email)
        if(!foundUser) throw new AuthFailureError('user not registed');

        //3
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = await createTokenPair({userId,email},publicKey,privateKey)

        //4
        await keyStore.updateOne({
            $set:{//replace value of field with specific value
                publicKey,
                refreshToken:tokens.refreshToken
            },
            $addToSet:{//adds a value to an array unless the value is already present, in which case it does nothing to array
                refreshTokensUsed:refreshToken
            }
        })

        return {
            user,
            tokens  
        }
    };

    static logout = async( keyStore: IKeyToken )=>{
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as Types.ObjectId);
        return delKey 
    };

    static update = async(userId: Types.ObjectId, login: LoginDTO, payload: { newName?: string, newPassword?: string, newEmail?: string })=>{
        console.log('userId',userId);
        console.log('login',login)
        console.log('payload',payload)
        console.log('newName',payload.newName)
        const errors = await validate(login)
        if(errors.length > 0){
            this.logger(errors)
        }
        const foundUser = await this.findUser(login.email);
        if (!foundUser) throw new BadRequestError('User not registered');

        const passwordHashed = await this.hashPassword(login.password, foundUser.salt);
        if (passwordHashed !== foundUser.password) throw new AuthFailureError('Wrong password!');

        // 2. Prepare update data
        interface query{
            name?: string;
            email?: string;
            password?: string;
            salt?: string
        }

        const updateFields: query = {};
        console.log('this is update fields',updateFields)
        if (payload.newName) updateFields.name = payload.newName;
        if (payload.newEmail) updateFields.email = payload.newEmail;
        
        // 3. If the password is updated, hash the new password
        if (payload.newPassword) {
            const newSalt = crypto.randomBytes(32).toString();
            const newPasswordHashed = await this.hashPassword(payload.newPassword, newSalt);
            updateFields.password = newPasswordHashed;
            updateFields.salt = newSalt;
        }

        // Update user information in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, {isNew: true}).lean();
        if (!updatedUser) throw new BadRequestError('Update failed');

        // 4. Generate new token pair
        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = await createTokenPair({ userId: updatedUser._id, email: updatedUser.email }, publicKey, privateKey);

        // 5. Update token store
        await KeyTokenService.createKeyToken({
            userId: updatedUser._id,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        // 6. Return updated user and new tokens
        return {
            user: getInfoData(['_id', 'email', 'name'], updatedUser),
            tokens,
        };

    }

    static login = async(login:LoginDTO)=>{
        /*
            1 - check email in database
            2 - match password
            3 - create access token, refresh token and save
            4 - generate tokens
            5 - get data return login
        */
        const errors = await validate(login)
        if(errors.length > 0){
            this.logger(errors)
        }
        // 1
        const foundUser = await this.findUser(login.email)
        if(!foundUser) throw new BadRequestError('User not registed');

        // 2
        const passwordHashed =await this.hashPassword(login.password, foundUser.salt);
        if (passwordHashed !== foundUser.password) throw new AuthFailureError('Wrong password!!!');
        
        /**
         * 3
         * re-create key-pair for each workstation
         * safer, but reduce our perfomance
        */

        const { publicKey, privateKey } = this.generateKeyPair();
        const { _id:userId } = foundUser;
        const tokens = await createTokenPair({userId,email: login.email}, publicKey, privateKey);

        //4n
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            publicKey,
            refreshToken:tokens.refreshToken,
        })

        //5
        return{
            shop:getInfoData(['_id','email'],foundUser),
            tokens
        }
    }

    static async register(register: RegisterDTO){
        /**
         * 1 - validate input dataa
         * 2 - check wheather user existed or not
         * 3 - create salt and hashed password
         * 4 - create new user
         * 5 - create public/private key pair and access/refresh token pair
         * 6 - create keytoken which store publickey and refresh token in database
        */
        const errors = await validate(register);
        if (errors.length > 0) {
            this.logger(errors)
        } 
        //1
        const userHolder = await this.findUser(register.email);
        if(userHolder) throw new BadRequestError('User already existed');

        //2
        const salt = crypto.randomBytes(32).toString();
        const passwordHashed =await this.hashPassword(register.password, salt)
        console.log('this is password hashed',passwordHashed)

        //3
        const newUser = await User.create({
            name: register.name,
            salt,
            email: register.email,
            password:passwordHashed,
        })

        if(newUser){
            //4
            const { publicKey, privateKey } = this.generateKeyPair();
            const tokens =await createTokenPair({userId:newUser._id, email: newUser.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')

            //5
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey
            })
            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                shop:getInfoData(['_id','email'],newUser),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }
    }
}

export default AccessService