
import { Admin } from 'src/entities/admin.entity';
import { User } from 'src/entities/user.entity';
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