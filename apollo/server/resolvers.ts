const resolvers = {
  Major: {
    faculties: (major, _, { dataSources }) => {
      //({ code }, args, { dataSources }) => {
      return major.faculties.map((faculty) =>
        dataSources.facultiesAPI.getFaculty(faculty)
      );
      //return context.dataSources.majorsAPI.getMajor(code);
    },
  },
  Query: {
    users() {
      return [{ id: 0, firstName: "Nextjs" }];
    },
    tests: async (_, __, { dataSources }) => {
      return dataSources.testAPI.findTests();
    },
    faculties: async (_, __, { dataSources }) => {
      return dataSources.facultiesAPI.getFaculties();
    },
    faculty: async (_, { code }, { dataSources }) => {
      return dataSources.facultiesAPI.getFaculty(code);
    },
    majors: async (_, __, { dataSources }) => {
      return dataSources.majorsAPI.getMajors();
    },
    major: async (_, { code }, { dataSources }) => {
      return dataSources.majorsAPI.getMajor(code);
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
