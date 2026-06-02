import categoryController from "../controllers/category.controller.js";
import express from "express";
const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategoryById);
router.delete("/:id", categoryController.deleteCategoryById);

export default router;
