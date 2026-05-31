import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import menuRoutes from "./routes/menu.routes.js";

dotenv.config({ path: ".env" });
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.use("/menus", menuRoutes);

app.listen(PORT, () => {
  console.log("Express server running in port: " + PORT);
});
