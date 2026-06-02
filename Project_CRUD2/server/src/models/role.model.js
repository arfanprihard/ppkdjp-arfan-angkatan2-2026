import database from "../config/database.js";

const getAllRoles = async () => {
  const [rows] = await database.execute("SELECT * FROM roles ORDER BY id DESC");
  return rows;
};

const getRoleById = async (id) => {
  const [rows] = await database.execute("SELECT * FROM roles WHERE id=?", [id]);
  return rows;
};

const createRole = async (body) => {
  const [result] = await database.execute(
    "INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)",
    [body.name, body.description || null, body.is_active],
  );
  return result;
};

const updateRoleById = async (body, id) => {
  const [result] = await database.execute(
    "UPDATE roles SET name=?, description=?, is_active=? WHERE id=?",
    [body.name, body.description || null, body.is_active, id],
  );
  return result;
};

const deleteRoleById = async (id) => {
  const [result] = await database.execute("DELETE FROM roles WHERE id=?", [id]);
  return result;
};

export default { getAllRoles, getRoleById, createRole, updateRoleById, deleteRoleById };
