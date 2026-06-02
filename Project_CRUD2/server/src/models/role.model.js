import database from "../config/database.js";

const getAllRoles = async () => {
  const [rows] = await database.execute("SELECT * FROM roles");
  return rows;
};

export default { getAllRoles };
