import { DataSource } from "apollo-datasource";
import {
  Executive,
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
} from "@/models/Executive";
import { ContextBase } from "@/types/datasources";

const transformData = (executive: Executive): ExecutiveAttributes => {
  return executive.get({ plain: true });
};

/** An API to retrieve data from the Executive store */
export default class ExecutiveAPI extends DataSource<ContextBase> {
  /** The Executive store */
  private store: typeof Executive;

  /**
   * Create the API instance.
   * @param {typeof Executive} executiveStore - A Executive store.
   */
  constructor(executiveStore: typeof Executive) {
    super();
    this.store = executiveStore;
  }

  /**
   * Find all executives
   * @async
   * @returns {Promise<ExecutiveAttributes[]>} An array of executives
   */
  public async findExecutives(): Promise<ExecutiveAttributes[]> {
    const executives = await this.store.findAll();
    return executives.map(transformData);
  }

  /**
   * Add a new executive
   * @async
   * @param {ExecutiveCreationAttributes} arg - The arg for the new executive
   * @returns {Promise<ExecutiveAttributes>} An instance of the new executive
   */
  public async addNewExecutive(
    arg: ExecutiveCreationAttributes
  ): Promise<ExecutiveAttributes> {
    const executive = await this.store.create(arg);
    return transformData(executive);
  }
}
