/* eslint-disable */

process.on("exit", function (code) {
  return console.log(`About to exit with code ${code}`);
});

(async () => {
  const migration = require("../migrations/index.js");
  await migration();
  const updateJwtSrcret = require("./create_jwt_key_pair.js");
  await updateJwtSrcret();
  process.exit(0);
})();
