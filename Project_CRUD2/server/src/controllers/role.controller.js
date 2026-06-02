import roleModel from "../models/role.model.js";

const getAllRoles = async (req, res) => {
  try {
    const data = await roleModel.getAllRoles();
    res.status(200).json({
      message: "Get all roles success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await roleModel.getRoleById(id);
    res.status(200).json({
      message: "Get role by id success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { body } = req;
    if (!body.name || body.is_active === undefined || body.is_active === "") {
      res.status(400).json({
        message: "Data tidak sesuai!",
        data: null,
      });
      return;
    }
    await roleModel.createRole(body);
    res.status(201).json({
      message: "Create role success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await roleModel.updateRoleById(body, id);
    res.status(200).json({
      message: "Update role success",
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

const deleteRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    await roleModel.deleteRoleById(id);
    res.status(200).json({
      message: "Delete role success",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export default { getAllRoles, getRoleById, createRole, updateRoleById, deleteRoleById };
