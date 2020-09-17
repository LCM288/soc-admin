import { DataSource } from "apollo-datasource";
import {
  Executive,
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
} from "../models/Executive";
import { ContextBase } from "../types/datasources";

const transformData = (executive: Executive): ExecutiveAttributes => {
  return executive.get({ plain: true });
};

export default class ExecutiveAPI extends DataSource<ContextBase> {
  private store: typeof Executive;

  constructor(executiveStore: typeof Executive) {
    super();
    this.store = executiveStore;
  }

  public async findExecutives(): Promise<ExecutiveAttributes[]> {
    const executives = await this.store.findAll();
    return executives.map(transformData);
  }

  public async addNewExecutive(
    arg: ExecutiveCreationAttributes
  ): Promise<ExecutiveAttributes> {
    const executive = await this.store.create(arg);
    return transformData(executive);
  }
}
