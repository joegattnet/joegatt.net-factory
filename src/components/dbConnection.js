const { Pool } = require("pg");

const dbConnection = new Pool({
  user: process.env.JOEGATTNET_USER,
  host: "172.19.0.2",
  database: process.env.JOEGATTNET_USER,
  password: process.env.JOEGATTNET_PASSWORD,
  port: 5432,
});

module.exports.dbConnection = dbConnection;
