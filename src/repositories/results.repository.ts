import { EntityRepository } from "@mikro-orm/core";
import { TestResult, TestResultWithoutPdf } from "src/entities/test-result.entity";

export class TestResultRepository extends EntityRepository<TestResult>{
    async FindAllForAdmin() : Promise<TestResultWithoutPdf[]>{
        return await this.findAll({
            fields: ['id', 'user', 'testName', 'size', 'testDate', 'machine'],
            orderBy: { testDate: 'DESC' }
        });
    }

    async FindAllForUser(pid: string) : Promise<TestResultWithoutPdf[]>{
        return await this.find({ user: { pid } },
            {
                fields: ['id', 'user', 'testName', 'size', 'testDate', 'machine'],
                orderBy: { testDate: 'DESC' }
            },
      );
    }

    async FindForMachine(machineId: string){
        return await this.find(
            { machine: {fingerPrint: machineId} },
                {
                    fields: ['id', 'user', 'testName', 'size', 'testDate', 'machine'], // applying projection
                },
        );
    }
}