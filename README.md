[![License](https://badgen.net/github/license/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/blob/master/LICENSE)
[![Commits](https://badgen.net/github/commits/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin)
[![Last Commit](https://badgen.net/github/last-commit/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin)
[![Build Status](https://badgen.net/travis/LCM288/soc-admin?cache=600)](https://travis-ci.com/LCM288/soc-admin)
[![Open Issues](https://badgen.net/github/open-issues/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/issues)
[![Open PRs](https://badgen.net/github/open-prs/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/pulls)

# For dev

## Setup procedure

1. install `postgresql`, `node.js` and `yarn`
2. put a `.env` file in root following the variables in `.env.example`
3. run `yarn install` to install all dependencies
4. run `yarn newdb` then `yarn migrate` to set up the database
5. run `yarn generate` to generate jwt secret
6. run `yarn dev` to start the server

## Useful docs
- Database: [Sequelize](https://sequelize.org/master/index.html) / [Umzug](https://github.com/sequelize/umzug/tree/v2.x)
- Backend: [Graphql](https://graphql.org/learn/) / [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- Frontend: [Next](https://nextjs.org/docs/getting-started) / [React](https://reactjs.org/docs/getting-started.html) / [Apollo Client](https://www.apollographql.com/docs/react/)
- Miscellaneous:  [Axios](https://github.com/axios/axios) / [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) / [Jest](https://jestjs.io/docs/en/getting-started)
