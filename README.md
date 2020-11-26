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
2. On Heroku, create a new app with a custom name, choose the region United States
   ![image](https://user-images.githubusercontent.com/17256738/100370100-bc4af000-3040-11eb-9e88-f4c735d9cdac.png) 
   ![image](https://user-images.githubusercontent.com/17256738/100370282-00d68b80-3041-11eb-98e3-ab8acdccd147.png)
3. 1. At the new app's dashboard
   2. Go to `Overview` tab
   ![image](https://user-images.githubusercontent.com/17256738/100370482-4f842580-3041-11eb-8de5-6cff31648b3e.png)
   3. Click `Configure Add-ons`
   ![image](https://user-images.githubusercontent.com/17256738/100370550-6a569a00-3041-11eb-9c87-b2c0cdfd312f.png)
   4. Input `Heroku Postgres` at the `add-on` section
   ![image](https://user-images.githubusercontent.com/17256738/100370645-8a865900-3041-11eb-86e7-febb378cfcb2.png)
   5. Choose the plan `Hobby Dev - Free` and then submit
   ![image](https://user-images.githubusercontent.com/17256738/100370716-a689fa80-3041-11eb-80ef-5087420202de.png)
4. 1. Go to `Deploy` tab
   ![image](https://user-images.githubusercontent.com/17256738/100370839-ddf8a700-3041-11eb-808a-b8014db0c8a9.png)
   2. Choose `Github` as the deployment method
      ![image](https://user-images.githubusercontent.com/17256738/100370981-15675380-3042-11eb-8fc8-863fbaa01fc0.png)
   3. Link your Github account with Heroku
   4. choose the forked repo
      ![image](https://user-images.githubusercontent.com/17256738/100371246-755dfa00-3042-11eb-9e68-f8a77c009813.png)
   5. Deploy the branch `master` (or `main`) manually
      ![image](https://user-images.githubusercontent.com/17256738/100371601-0208b800-3043-11eb-8aae-00a22e1d10ef.png)
   6. Wait until the deployment finished (it may take serval minutes)
      ![image](https://user-images.githubusercontent.com/17256738/100372102-bc98ba80-3043-11eb-8ed2-65d51c043e7e.png)
5. Goto `https://your-app-name.herokuapp.com` (remember to replace with your app name) to test the deployment
6. If successful, you will be at the `Initialise Client keys` page
   ![image](https://user-images.githubusercontent.com/17256738/100372181-da661f80-3043-11eb-820d-8f803c691caf.png)
7. 1. Open Azure on another window, make sure the language is English
      ![image](https://user-images.githubusercontent.com/17256738/100372358-1600e980-3044-11eb-861e-28bafcf97e11.png)
   2. Search `App registrations`
      ![image](https://user-images.githubusercontent.com/17256738/100372461-38930280-3044-11eb-8e00-c151c38f6813.png)
   3. Click `New registration`
      ![image](https://user-images.githubusercontent.com/17256738/100372555-5eb8a280-3044-11eb-828a-5ac0837af317.png)
   4. Setup the display name for your application
      ![image](https://user-images.githubusercontent.com/17256738/100372697-9889a900-3044-11eb-838f-3bfba64de951.png)
   5. Choose `Accounts in any organizational directory (Any Azure AD directory - Multitenant)` for `Supported account types`
   6. At `Redirect URI` insert `https://your-app-name.herokuapp.com/api/login` (remember to replace with your app name)
      ![image](https://user-images.githubusercontent.com/17256738/100372804-c242d000-3044-11eb-8fc6-ab3a54796754.png)
   7. Click `Register`
   8. Copy `Application (client) ID` and paste it onto the `Client ID` field on the `Initialise Client keys` page
      ![image](https://user-images.githubusercontent.com/17256738/100373022-0e8e1000-3045-11eb-86b2-e4d2ef5b067f.png)
      ![image](https://user-images.githubusercontent.com/17256738/100373097-31b8bf80-3045-11eb-8ef7-a1387da4a1d3.png)
   9. On the Azure's page, find and go to `Certificates & secrets` on the left panel
      ![image](https://user-images.githubusercontent.com/17256738/100373171-52811500-3045-11eb-8998-8bd2933124a5.png)
   10. Go to section `Client secrets` and click `New client secrets`
      ![image](https://user-images.githubusercontent.com/17256738/100373249-6f1d4d00-3045-11eb-971a-1fe65830e39b.png)
   11. Input a custom description and choose the exire time as `Never`
      ![image](https://user-images.githubusercontent.com/17256738/100373343-98d67400-3045-11eb-8440-da986980046f.png)
   12. Click `Add`
   13. Copy the `Value` and paste it onto the `Client Secret` field on the `Initialise Client keys` page
      ![image](https://user-images.githubusercontent.com/17256738/100373445-bf94aa80-3045-11eb-8d1a-e6c18f93e78f.png)
      ![image](https://user-images.githubusercontent.com/17256738/100373521-dd620f80-3045-11eb-802d-252596c8f4b8.png)
   14. Click the `Initialise` button on the `Initialise Client keys` page
8. Login with your CUHK link account
9. Accept the permission request if applicable
   ![image](https://user-images.githubusercontent.com/17256738/100373654-100c0800-3046-11eb-84f8-cfff184b9ae9.png)
10. Set yourself as an executive by inputing your nickname and position
   ![image](https://user-images.githubusercontent.com/17256738/100374547-6a599880-3047-11eb-860f-d78df5f860be.png)
11. Import members and setup other admins
12. Done

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
