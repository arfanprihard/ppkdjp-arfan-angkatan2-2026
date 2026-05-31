import userModel from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const data = await userModel.getAllUsers();
    res.status(200).json({
      message: "Get all user success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await userModel.getUserById(id);
    res.status(200).json({
      message: "Get user by id success",
      id: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { body } = req;
    if (!body.email || !body.password || !body.name) {
      res.status(400).json({
        message: "Data tidak sesuai!",
        data: null,
      });
    }
    await userModel.createUser(body);
    res.status(201).json({
      message: "Create user success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await userModel.updateUserById(body, id);
    res.status(200).json({
      message: "Update user success",
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

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.deleteUserById(id);
    res.status(200).json({
      message: "Delete user success",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
