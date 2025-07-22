import { Request } from "express"
import { Admin } from "src/entities/admin.entity"
import { User } from "src/entities/user.entity"

export interface AuthenticatedRequest extends Request{
    user? : User;
    admin?: Admin;
}  
