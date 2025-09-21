import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FeatureFlagService } from "src/modules/feature-flag/feature-flag.service";
import { FEATURE_FLAG_KEY } from "../decorators/feature-flag.decorator";
import { Request } from "express";

@Injectable()
export class FeatureFlagGuard implements CanActivate {
    private readonly logger = new Logger(FeatureFlagGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly featureFlagService: FeatureFlagService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const flag = this.reflector.get<string>(
            FEATURE_FLAG_KEY,
            context.getHandler()
        );

        if (!flag) return true;

        const request : Request = context.switchToHttp().getRequest();
        const { method, url } = request;

        // Evaluate feature flag
        const isOn = await this.featureFlagService.isFeatureOn(flag);

        // Preserve metadata shape but add richer logs
        this.logger.log(
            `[${method}] ${url} | Feature: ${flag} | Enabled: ${isOn}`
        );

        if (!isOn) {
            this.logger.warn(
                `[${method}] ${url} | Access denied - Feature ${flag} is disabled.`
            );
            throw new ForbiddenException(`Feature ${flag} is disabled.`);
        }

        return true;
    }
}
