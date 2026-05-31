import express from "express";
import menuController from "../controller/menu.controller.js";

const router = express.Router();

router.get("/", menuController.getAllMenus);
router.post("/", menuController.createMenu);
router.patch("/:id", menuController.updateMenuById);
router.delete("/:id", menuController.deleteMenuById);

export default router;
