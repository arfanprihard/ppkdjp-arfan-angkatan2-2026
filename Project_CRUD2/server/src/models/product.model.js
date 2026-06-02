import database from "../config/database.js";

const getAllProducts = async () => {
  const [rows] = await database.execute(
    "SELECT products.*, categories.name as category_name FROM products JOIN categories ON products.category_id = categories.id ORDER BY products.id DESC"
  );
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await database.execute("SELECT * FROM products WHERE id=?", [id]);
  return rows;
};

const createProduct = async (body) => {
  const [result] = await database.execute(
    "INSERT INTO products (category_id, name, image, qty, price, unit, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      body.category_id,
      body.name,
      body.image || null,
      body.qty,
      body.price,
      body.unit,
      body.description || null,
      body.is_active,
    ],
  );
  return result;
};

const updateProductById = async (body, id) => {
  const [result] = await database.execute(
    "UPDATE products SET category_id=?, name=?, image=?, qty=?, price=?, unit=?, description=?, is_active=? WHERE id=?",
    [
      body.category_id,
      body.name,
      body.image || null,
      body.qty,
      body.price,
      body.unit,
      body.description || null,
      body.is_active,
      id,
    ],
  );
  return result;
};

const deleteProductById = async (id) => {
  const [result] = await database.execute("DELETE FROM products WHERE id=?", [id]);
  return result;
};

export default { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById };
