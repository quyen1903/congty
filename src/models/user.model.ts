import{model,Schema} from'mongoose';

const DOCUMENT_NAME='User'
const COLLECTION_NAME='Users'

export interface IUser extends Document{
    name: string;
    salt: string;
    email: string;
    password: string;

};
// Declare the Schema of the Mongo model
const shopSchema: Schema = new Schema<IUser>({
    name:{ type:String, maxLength:150 },
    salt:{ type:String, required:true },
    email:{ type:String, unique:true, trim:true },
    password:{ type:String, required:true },
},{
    timestamps:true,
    collection:COLLECTION_NAME
}
);

//Export the model
export default model<IUser>(DOCUMENT_NAME, shopSchema);