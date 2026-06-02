import database from "../config/database.js";

const getAllMenus = async () => {
  const [rows] = await database.execute(
    "SELECT menus.*, parent.name AS parent_name FROM menus LEFT JOIN menus AS parent ON parent.id = menus.id_parent ORDER BY menus.id ASC",
  );
  return rows;
};

const createMenu = async (body) => {
  const [result] = await database.execute(
    "INSERT INTO menus (id_parent, name, url, icon, sort_order, is_active) VALUES (? , ?, ?, ?, ?, ?)",
    [
      body.id_parent,
      body.name,
      body.url,
      body.icon,
      body.sort_order,
      body.is_active,
    ],
  );
  return result;
};

const updateMenuById = async (body, id) => {
  const [result] = await database.execute(
    "UPDATE menus SET id_parent=?, name=?, url=?, icon=?, sort_order=?, is_active=? WHERE id=?",
    [
      body.id_parent,
      body.name,
      body.url,
      body.icon,
      body.sort_order,
      body.is_active,
      id,
    ],
  );
  return result;
};

const deleteMenuById = async (id) => {
  const [result] = await database.execute("DELETE FROM menus WHERE id=?", [id]);
  return result;
};

export default { getAllMenus, createMenu, updateMenuById, deleteMenuById };
