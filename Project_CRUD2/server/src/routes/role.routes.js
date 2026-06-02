import roleController from "../controllers/role.controller.js";
import express from "express";
const router = express.Router();

router.get("/", roleController.getAllRoles);

export default router;
