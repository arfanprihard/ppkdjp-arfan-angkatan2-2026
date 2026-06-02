import productModel from "../models/product.model.js";

const getAllProducts = async (req, res) => {
  try {
    const data = await productModel.getAllProducts();
    res.status(200).json({
      message: "Get all products success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productModel.getProductById(id);
    res.status(200).json({
      message: "Get product by id success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    if (!body.name || !body.category_id || !body.qty || !body.price || !body.unit || body.is_active === undefined || body.is_active === "") {
      res.status(400).json({
        message: "Data tidak sesuai!",
        data: null,
      });
      return;
    }
    await productModel.createProduct(body);
    res.status(201).json({
      message: "Create product success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await productModel.updateProductById(body, id);
    res.status(200).json({
      message: "Update product success",
      id: id,
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.deleteProductById(id);
    res.status(200).json({
      message: "Delete product success",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export default { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById };
