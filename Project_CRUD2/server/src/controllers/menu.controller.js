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

const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await menuModel.getMenuById(id);
    res.status(200).json({
      message: "Get menu by id success",
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
    if (!body.name) {
      res.status(400).json({
        message: "Data tidak sesuai!",
        data: null,
      });
      return;
    }
    await menuModel.createMenu(body);
    res.status(201).json({
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
    const { body } = req;
    await menuModel.updateMenuById(body, id);
    res.status(200).json({
      message: "Update menu success",
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

export default { getAllMenus, getMenuById, createMenu, updateMenuById, deleteMenuById };
