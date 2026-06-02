import roleController from "../controllers/role.controller.js";
import express from "express";
const router = express.Router();

router.get("/", roleController.getAllRoles);
router.get("/:id", roleController.getRoleById);
router.post("/", roleController.createRole);
router.patch("/:id", roleController.updateRoleById);
router.delete("/:id", roleController.deleteRoleById);

export default router;
