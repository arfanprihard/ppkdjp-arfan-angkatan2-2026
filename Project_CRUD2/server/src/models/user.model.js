import database from "../config/database.js";
const getAllUsers = async () => {
  const [rows] = await database.execute(
    "SELECT users.id, users.name, users.email, roles.name as role FROM users JOIN roles ON users.role_id = roles.id ORDER BY users.id DESC",
  );
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await database.execute("SELECT * FROM users WHERE id=?", [id]);
  return rows;
};

const createUser = async (body) => {
  const [result] = await database.execute(
    "INSERT Into users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
    [body.name, body.email, body.password, body.role_id],
  );
  return result;
};

const updateUserById = async (body, id) => {
  const fields = ["name=?", "email=?"];
  const values = [body.name, body.email];

  if (body.password) {
    fields.push("password=?");
    values.push(body.password);
  }

  fields.push("role_id=?");
  values.push(body.role_id);
  values.push(id);

  const [result] = await database.execute(
    `UPDATE users SET ${fields.join(", ")} WHERE id=?`,
    values,
  );
  return result;
};

const deleteUserById = async (id) => {
  const [result] = await database.execute("DELETE FROM users WHERE id = ?", [
    id,
  ]);
  return result;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
