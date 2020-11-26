[![License](https://badgen.net/github/license/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/blob/master/LICENSE)
[![Commits](https://badgen.net/github/commits/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin)
[![Last Commit](https://badgen.net/github/last-commit/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin)
[![Build Status](https://badgen.net/travis/LCM288/soc-admin?cache=600)](https://travis-ci.com/LCM288/soc-admin)
[![Open Issues](https://badgen.net/github/open-issues/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/issues)
[![Open PRs](https://badgen.net/github/open-prs/LCM288/soc-admin?cache=600)](https://github.com/LCM288/soc-admin/pulls)

# For Societies' Executive Committees

## Prerequisite

You may need a personal or society's account for

- [Microsoft Azure](https://portal.azure.com/) (please note that the school account (1155xxxxxx@link.cuhk.edu.hk) is not applicable)
- [Heroku](https://www.heroku.com/)
- [Github](https://github.com/)

## Setup procedure

1. Fork this repository
2. Link your Github account with Heroku [tutorial](https://devcenter.heroku.com/articles/github-integration#enabling-github-integration)
3. On Heroku, create a new app with a custom name, choose the region United States
4. 1. At the new app's dashboard
   2. Go to `Overview` tab
   3. Click `Configure Add-ons`
   4. Input `Heroku Postgres` at the `add-on` section
   5. Choose the plan `Hobby Dev - Free`
   6. Submit
5. 1. At the new app's dashboard
   2. Go to `Deploy` tab
   3. Choose `Github` as the deployment method, and choose the forked repo
   4. You can either enable automatic deploy on the `master` (or `main`) branch or deploy the branch manually
   5. Wait until the deployment finished
6. Goto `https://your-app-name.herokuapp.com` (remember to replace with your app name) to test the deployment
7. If successful, you will be at the `Initialise Client keys` page
8. 1. Open Azure on another window
   2. Search `App registrations`
   3. Click `+ New registration`
   4. Setup the display name for your application
   5. Choose `Accounts in any organizational directory (Any Azure AD directory - Multitenant)` for `Supported account types`
   6. At `Redirect URI` insert `https://your-app-name.herokuapp.com/api/login` (remember to replace with your app name)
   7. Click `Register`
   8. Copy `Application (client) ID` and paste it onto the `Client ID` field on the `Initialise Client keys` page
   9. On the Azure's page, find and go to `Certificates & secrets` on the left panel
   10. Go to section `Client secrets` and click `+ New client secrets`
   11. Input a custom description and choose the exire time as `Never`
   12. Click `Add`
   13. Copy the `Value` and paste it onto the `Client Secret` field on the `Initialise Client keys` page
   14. Click the `Initialise` button on the `Initialise Client keys` page
9. Login with your CUHK link account
10. Accept the permission request if applicable
11. Set yourself as an executive by inputing your nickname and position
12. Submit
13. Import members and setup other admins
14. Done

# For Developers

## Setup procedure

1. Install `postgresql`, `node.js` and `yarn`
2. Put a `.env` file in root following the variables in `.env.example`
3. Run `yarn install` to install all dependencies
4. Run `yarn newdb` set up the database
5. Run `yarn release` to generate sync the database and generate jwt secret
6. Run `yarn dev` to start the server

## Useful docs

- [Soc-admin](https://lcm288.github.io/soc-admin/)
- Database: [Sequelize](https://sequelize.org/master/index.html) / [Umzug](https://github.com/sequelize/umzug/tree/v2.x)
- Backend: [Graphql](https://graphql.org/learn/) / [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- Frontend: [Apollo Client](https://www.apollographql.com/docs/react/) / [Next](https://nextjs.org/docs/getting-started) / [React](https://reactjs.org/docs/getting-started.html) / [react-bulma-components](https://github.com/couds/react-bulma-components) / [Bulma](https://bulma.io/)
- Miscellaneous: [Axios](https://github.com/axios/axios) / [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) / [Jest](https://jestjs.io/docs/en/getting-started)
