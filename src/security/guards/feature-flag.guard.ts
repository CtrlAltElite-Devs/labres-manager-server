import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FeatureFlagService } from "src/modules/feature-flag/feature-flag.service";
import { FEATURE_FLAG_KEY } from "../decorators/feature-flag.decorator";

@Injectable()
export class FeatureFlagGuard implements CanActivate {
    private logger = new Logger(FeatureFlagGuard.name);

    constructor(
        private reflector: Reflector,
        private featureFlagService: FeatureFlagService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const flag = this.reflector.get<string>(FEATURE_FLAG_KEY, context.getHandler());

        if(!flag) return true;

        const isOn = await this.featureFlagService.isFeatureOn(flag);
        this.logger.log(`Feature ${flag} is ${isOn}`);
        if(!isOn){
            throw new ForbiddenException(`Feature ${flag} is disabled.`);
        }

        return true;
    }

}