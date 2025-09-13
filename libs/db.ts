
import dotenv from "dotenv";
dotenv.config();

const Pool = require("pg-pool");



console.log(process.env.USERNAME);

const pool2 = new Pool({
  host: process.env.HOST,
  database: process.env.DB_NAME,
  user: process.env.USER,
  password: process.env.PASS,
  port: process.env.DB_PORT,
  ssl: false,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

export { pool2 };
