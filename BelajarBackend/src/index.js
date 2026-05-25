import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

dotenv.config({ path: ".env.development" });

const app = express();
const PORT = process.env.PORT;

// Setup adapter Prisma v7 (wajib untuk MySQL/MariaDB)
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

// Middleware
app.use(express.json());

// GET semua user
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data user", error });
  }
});

app.listen(PORT, () => {
  console.log("Express API running in port: " + PORT);
});
