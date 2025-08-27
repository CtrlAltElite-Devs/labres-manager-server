import { Admin } from "./admin.entity";
import { FeatureFlag } from "./feature-flag.entity";
import { License } from "./license.entity";
import { RefreshToken } from "./security/refresh-token.entity";
import { TestResult } from "./test-result.entity";
import { User } from "./user.entity";

export const entities = [User, Admin, TestResult, License, FeatureFlag, RefreshToken];