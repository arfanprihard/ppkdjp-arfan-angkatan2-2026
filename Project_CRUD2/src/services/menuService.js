import API_URL from "../config/api";

const getAllMenus = async () => {
  const response = await fetch(`${API_URL}/menus`);
  return response.json();
};

const getMenuById = async (id) => {
  const response = await fetch(`${API_URL}/menus/${id}`);
  return response.json();
};

const createMenu = async (body) => {
  const response = await fetch(`${API_URL}/menus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const updateMenu = async (id, body) => {
  const response = await fetch(`${API_URL}/menus/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const deleteMenu = async (id) => {
  const response = await fetch(`${API_URL}/menus/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export default { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu };
