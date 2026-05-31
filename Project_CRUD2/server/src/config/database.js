import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const database = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Fungsi untuk test koneksi yang sebenarnya
const testConnection = async () => {
  try {
    const connection = await database.getConnection();
    console.log("Berhasil terhubung ke database");
    connection.release();
  } catch (error) {
    console.error("Gagal terhubung ke database:", error.message);
  }
};

testConnection();

export default database;
