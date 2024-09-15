import { BadRequestError, NotFoundError } from '../core/error.response'
import JWT from 'jsonwebtoken'
export class MainService{
    static login = async (username: string, password: string) => {
        
        // mongoose validation
        // Joi
        // check in the controller
      
        if (!username || !password) {
          throw new BadRequestError('Please provide email and password')
        }
      
        //just for demo, normally provided by DB!!!!
        const id = new Date().getDate()
      
        // try to keep payload small, better experience for user
        // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
        const token = JWT.sign({ id, username }, process.env.JWT_SECRET as string, {
          expiresIn: '30d',
        })
      
        return{ msg: 'user created', token }
      }
      
    static dashboard = async (username: string) => {
        const luckyNumber = Math.floor(Math.random() * 100)
      
        return{
          msg: `Hello, ${username}`,
          secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
        }
      }
}