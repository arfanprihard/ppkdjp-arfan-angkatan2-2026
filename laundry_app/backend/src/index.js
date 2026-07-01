import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());



app.use("/", (req, res) => {
  res.status(404).json({
    message: "Endpoint not Found",
  });
});

app.listen(PORT, () => console.log("Running on port " + PORT));
