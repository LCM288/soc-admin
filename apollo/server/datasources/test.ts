import { DataSource } from "apollo-datasource";

export type Test = {
  id: string;
  message: string;
};

class TestAPI extends DataSource {
  store: any;

  context: any;

  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: any): void {
    this.context = config.context;
  }

  async findTests(): Promise<Test[]> {
    const tests = await this.store.tests.findAll();
    return tests || [];
  }

  async insertTestMessage({ message }: { message: string }): Promise<Test> {
    const test = await this.store.tests.create({ message });
    return test;
  }
}

export default TestAPI;
