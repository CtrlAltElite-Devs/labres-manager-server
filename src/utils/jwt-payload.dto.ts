
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

export class JwtHelper {
    static Extract(payload: JwtUserPayloadDto) : JwtUserPayloadDto{
        if(payload.isAdmin){
            return {
                adminId: payload.adminId,
                isAdmin: true
            }   
        } else {
            return {
                pid: payload.pid,
                dob: payload.dob,
                isAdmin: false
            }
        }
    }
}