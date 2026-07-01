import mysql from "mysql2/promise";
import dotenv from "dotenv";

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  user: process.env.UB_USERNAME,
});

dbPool
  .getConnection()
  .then((connection) => {
    console.log("Berhasil terhubung ke database");
    connection.release();
  })
  .catch((err) => {
    console.error("Gagal konek ke database, Error: " + err.message);
  });

const query = async (sql, params = []) => {
  const result = await dbPool.execute(sql, params);
  return result;
};
