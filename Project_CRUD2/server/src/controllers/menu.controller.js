import menuModel from "../models/menu.model.js";

const getAllMenus = async (req, res) => {
  try {
    const data = await menuModel.getAllMenus();
    res.status(200).json({
      message: "Get all menus success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createMenu = async (req, res) => {
  try {
    const { body } = req;
    await menuModel.createMenu();
    res.status(200).json({
      message: "Create menu success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    await menuModel.updateMenuById(id);
    res.status(200).json({
      message: "Update menu succes",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const deleteMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    await menuModel.deleteMenuById(id);
    res.status(200).json({
      message: "Delete menu success",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export default { getAllMenus, createMenu, updateMenuById, deleteMenuById };
