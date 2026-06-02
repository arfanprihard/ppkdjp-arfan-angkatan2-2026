import categoryModel from "../models/category.model.js";

const getAllCategories = async (req, res) => {
  try {
    const data = await categoryModel.getAllCategories();
    res.status(200).json({
      message: "Get all categories success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryModel.getCategoryById(id);
    res.status(200).json({
      message: "Get category by id success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { body } = req;
    if (!body.name) {
      res.status(400).json({
        message: "Data tidak sesuai!",
        data: null,
      });
      return;
    }
    await categoryModel.createCategory(body);
    res.status(201).json({
      message: "Create category success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await categoryModel.updateCategoryById(body, id);
    res.status(200).json({
      message: "Update category success",
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

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.deleteCategoryById(id);
    res.status(200).json({
      message: "Delete category success",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export default { getAllCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };
