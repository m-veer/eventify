// import User from './models/user'; // Adjust the path based on your project structure
import { IUser } from '../../models/user'; // Adjust path if necessary
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  // Adding the 'user' property to Request interface
    }
  }
}

interface UserRequest extends Request {
  user?: IUser // or any other type
}

export {
  UserRequest
};
