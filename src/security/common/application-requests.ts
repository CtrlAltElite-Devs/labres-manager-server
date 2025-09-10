import { Request } from "express"
import { AdminDto } from "src/modules/admin/dto/admin.dto";
import { UserDto } from "src/modules/auth/dto/user.dto";

export interface AuthenticatedRequest extends Request{
    user? : UserDto;
    admin?: AdminDto;
}  
