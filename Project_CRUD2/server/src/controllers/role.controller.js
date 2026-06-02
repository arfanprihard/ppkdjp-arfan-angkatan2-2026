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

export default { getAllRoles };
