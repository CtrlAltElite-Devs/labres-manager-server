import { EntityRepository } from "@mikro-orm/core";
import { User } from "src/entities/user.entity";
import { ValidatedTestResultV2 } from '../modules/results/validators/result.validator';
import { Logger } from "@nestjs/common";

export class UserRepository extends EntityRepository<User>{
    private readonly logger = new Logger(UserRepository.name);

    async getOrCreateUser(data: ValidatedTestResultV2){
        const existingUser = await this.findOne({pid: data.pid});

        if(existingUser !== null){
            this.logger.log(`existing user found`);
            return existingUser;
        }

        this.logger.log(`No Existing user, will create user for pid:${data.pid}`);
        const newUser = User.CreateV2(data);
        this.create(newUser);
        return newUser;
    }
}