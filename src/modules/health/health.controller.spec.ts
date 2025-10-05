import {Test} from "@nestjs/testing"
import { HealthController } from "./health.controller"

describe("HealthController", () => {
    let healthController: HealthController

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [HealthController]
        }).compile();

        healthController = moduleRef.get(HealthController);
    });

    describe("status", () => {
        it("should return healthy", () => {
            const result = "healthy";
            expect(healthController.Status()).toBe(result);
        })
    })

    describe("statusV2", () => {
        it("should return healthy v2", () => {
            expect(healthController.StatusV2()).toBe("healthy v2")
        })
    })
});