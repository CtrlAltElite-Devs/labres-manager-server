import { User } from '../../entities/user.entity';
import { Admin } from '../../entities/admin.entity';

export class JwtUserPayloadDto {
    
    adminId?: string;
    isAdmin: boolean;

    pid?: string;
    dob?: Date;


    static MapUser(user: User){
        return {
            pid: user.pid,
            dob: user.dob,
            isAdmin: false
        }
    }

    static MapAdmin(admin: Admin){
        return {
            adminId: admin.id,
            isAdmin: true
        }
    }
}