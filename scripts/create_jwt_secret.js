/* eslint-disable */

var fs = require("fs");
var crypto = require("crypto");

fs.writeFile(
  __dirname + "/../.jwt_secret",
  require("crypto").randomBytes(256).toString("base64"),
  function (err) {
    if (err) throw err;
    console.log("Saved!");
  }
);
