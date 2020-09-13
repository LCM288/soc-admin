const resolvers = {
  Query: {
    users() {
      return [{ id: 0, firstName: "Nextjs" }];
    },
    tests: async (_, __, { dataSources }) => {
      return dataSources.testAPI.findTests();
    },
  },
  Mutation: {
    insertTestMessage: async (_, { message }, { dataSources }) => {
      const test = await dataSources.testAPI.insertTestMessage({ message });
      if (!test) {
        return { success: false, message: "Something wrong happened" };
      }
      return { success: true, message: "success", test };
    },
  },
};

export default resolvers;
