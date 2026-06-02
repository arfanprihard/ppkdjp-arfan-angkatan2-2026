import database from "../config/database.js";

const getAllCategories = async () => {
  const [rows] = await database.execute("SELECT * FROM categories ORDER BY id DESC");
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await database.execute("SELECT * FROM categories WHERE id=?", [id]);
  return rows;
};

const createCategory = async (body) => {
  const [result] = await database.execute(
    "INSERT INTO categories (name) VALUES (?)",
    [body.name],
  );
  return result;
};

const updateCategoryById = async (body, id) => {
  const [result] = await database.execute(
    "UPDATE categories SET name=? WHERE id=?",
    [body.name, id],
  );
  return result;
};

const deleteCategoryById = async (id) => {
  const [result] = await database.execute("DELETE FROM categories WHERE id=?", [id]);
  return result;
};

export default { getAllCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };
