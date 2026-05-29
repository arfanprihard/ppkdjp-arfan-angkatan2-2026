import database from "../config/database.js";
const getAllUsers = async () => {
  const [rows] = await database.execute("SELECT * FROM users");
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await database.execute("SELECT * FROM users WHERE id=?", [id]);
  return rows;
};

const createUser = async (body) => {
  const [result] = await database.execute(
    "INSERT Into users (name, email, password) VALUES (?, ?, ?)",
    [body.name, body.email, body.password],
  );
  return result;
};

const updateUser = async (body, id) => {
  const [result] = await database.execute(
    "UPDATE users SET name=?, email=?, password=? WHERE id=?",
    [body.email, body.email, body.password, id],
  );
  return result;
};

const deleteUser = async (id) => {
  const [result] = await database.execute("DELETE FROM users WHERE id = ?", [
    id,
  ]);
  return result;
};

export { getAllUsers, getUserById, createUser, deleteUser, updateUser };
