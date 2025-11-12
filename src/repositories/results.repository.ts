import { EntityRepository, Field } from "@mikro-orm/postgresql";
import { TestResult, TestResultWithoutPdf } from "src/entities/test-result.entity";
import { ResultQueryResourceParameters } from "src/modules/results/query-parameters/result-query-parameters";

export class TestResultRepository extends EntityRepository<TestResult> {
  private GetBasicFields() {
    const fields: Field<TestResult>[] = ["id", "user", "testName", "size", "testDate", "machine"]
    return fields;
  }

  async FindAllForAdmin(params: ResultQueryResourceParameters): Promise<TestResultWithoutPdf[]> {
    const resultsQuery = this.createQueryBuilder()
      .select(this.GetBasicFields())
      .orderBy({ testDate: "DESC" })

    // apply filtering
    resultsQuery.andWhere(params.GetFilters());

    return await resultsQuery.getResult();
  }

  async FindAllForUser(params: ResultQueryResourceParameters, pid: string): Promise<TestResultWithoutPdf[]> {
    const resultsQuery = this.createQueryBuilder()
      .select(this.GetBasicFields())
      .where({ user: { pid } })
      .orderBy({ testDate: "DESC" })

    // apply filtering
    resultsQuery.andWhere(params.GetFilters());

    return await resultsQuery.getResult();
  }

  async FindForMachine(machineId: string) {
    return await this.find(
      { machine: { fingerPrint: machineId } },
      {
        fields: ['id', 'user', 'testName', 'size', 'testDate', 'machine'], // applying projection
      },
    );
  }
}
