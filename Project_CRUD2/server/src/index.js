import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

dotenv.config({ path: ".env" });
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log("Express server running in port: " + PORT);
});
