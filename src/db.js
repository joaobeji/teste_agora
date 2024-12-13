require("dotenv").config();
const mysql = require("mysql2");

const conexaoDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: process.env.DB_TIMEOUT
});

conexaoDB.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log(
    "Conectado ao banco de dados MySQL porta: " + process.env.DB_PORT
  );
});

module.exports = conexaoDB;
