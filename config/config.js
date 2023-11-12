require('dotenv').config()

module.exports = {
  development: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql"
  }
}
