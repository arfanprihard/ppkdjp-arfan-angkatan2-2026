import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import roleRoutes from "./routes/role.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config({ path: ".env" });
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.use("/menus", menuRoutes);

app.use("/roles", roleRoutes);

app.use("/categories", categoryRoutes);

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("Express server running in port: " + PORT);
});

