import express from "express";
import userController from "../controller/user.controller.js";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.post("/", userController.createUser);

export default router;
