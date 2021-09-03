export {};

const { Client } = require("pg");
const config = require("../config");

const client = new Client(config.DB_CONNECTION);
client.connect();

const selectNoteSql = `
  SELECT id
  FROM notes
  LIMIT 1
`;

const fetchNote = async () => {
  const results = await client.query(selectNoteSql);
  return results.rows;
};

const pingDatabase = async () => {
  try {
    const note = await fetchNote();
    return note;
  } catch (error) {
    console.log('Query failed.');
  }

  client.end();
  process.exit();
};

module.exports = pingDatabase;
