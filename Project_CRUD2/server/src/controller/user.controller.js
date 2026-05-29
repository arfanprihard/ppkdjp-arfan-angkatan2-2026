import userModel from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const [data] = await userModel.getAllUsers();
    res.status(200).json({
      message: "Get all user success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

// const createUser = async (req, res) => {
//     try {
//         const [] = await
//     } catch (error) {

//     }
// };

export { getAllUsers };
