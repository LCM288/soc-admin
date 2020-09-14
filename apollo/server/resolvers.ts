const resolvers = {
  Major: {
    faculties: ({ faculties }, _, { dataSources }) => {
      return faculties.map((faculty) =>
        dataSources.facultyAPI.getFaculty(faculty)
      );
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
      return dataSources.facultyAPI.getFaculties();
    },
    faculty: async (_, { code }, { dataSources }) => {
      return dataSources.facultyAPI.getFaculty(code);
    },
    majors: async (_, __, { dataSources }) => {
      return dataSources.majorAPI.getMajors();
    },
    major: async (_, { code }, { dataSources }) => {
      return dataSources.majorAPI.getMajor(code);
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
