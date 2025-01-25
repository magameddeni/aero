import { Request } from "express"
import { IUser } from "./user"

interface RequestUser extends IUser {
  exp?: number
}

export interface IRequest extends Request {
  user?: RequestUser
}
