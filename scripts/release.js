/* eslint-disable */

(async () => {
  const migration = require("../migrations/index.js");
  await migration();
  require("./create_jwt_secret.js");
})();
