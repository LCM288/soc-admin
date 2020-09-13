const resolvers = {
  Query: {
    users() {
      return [{ id: 0, firstName: "Nextjs" }];
    },
    tests: async (_, __, { dataSources }) => {
      return await dataSources.testAPI.findTests();
    }
  },
  Mutation: {
    insertTestMessage: async (_, { message }, { dataSources }) => {
      const test = await dataSources.testAPI.insertTestMessage({ message });
      if (!test) {
        return { success: false, message: "Something wrong happened" };
      } else {
        return { success: true, message: "success", test };
      }
    }
  }
};

export default resolvers;
