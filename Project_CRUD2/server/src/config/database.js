import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
let database;
try {
  database = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });
  console.log("Berhasil terhubung ke database");
} catch (error) {
  console.error("Gagal terhubung ke database");
  console.error(error);
}

export default database;
