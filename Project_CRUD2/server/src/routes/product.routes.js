import productController from "../controllers/product.controller.js";
import express from "express";
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProductById);

export default router;
