import API_URL from "../config/api";

const getAllMenus = async () => {
  const response = await fetch(`${API_URL}/menus`);
  return response.json();
};

export default { getAllMenus };
