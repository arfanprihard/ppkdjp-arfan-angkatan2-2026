import express from "express";
import menuController from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.patch("/:id", menuController.updateMenuById);
router.delete("/:id", menuController.deleteMenuById);

export default router;
