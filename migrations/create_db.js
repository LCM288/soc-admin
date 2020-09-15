/* eslint-disable */

const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ database: "postgres" });
client.connect();
client.query(`CREATE DATABASE ${process.env.PGDB}`, () => {
  // create user's db ignoring any error
  client.end(); // close the connection
});
