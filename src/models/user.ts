import { RowDataPacket } from "mysql2"

export interface IModelUser extends RowDataPacket {
  id?: number
  email?: string
  phone?: string
  password?: boolean
}
