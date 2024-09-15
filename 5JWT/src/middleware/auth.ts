import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; 
import { AuthFailureError } from '../core/error.response';
interface Decode{
    id: string;
    username: string
}

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthFailureError('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET as string) as Decode
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    console.log(error)
    throw new AuthFailureError('Not authorized to access this route')
  }
}