// db.js
const sql = require('mssql');
const dbConfig = {
    user: "KowilDb",
    password: "Welcome@2025",
    server: "184.75.213.133",
    database: "TestData",
    port: 1623,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };

// Create a pool connection
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to the database");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

module.exports = { sql, poolPromise, dbConfig };
