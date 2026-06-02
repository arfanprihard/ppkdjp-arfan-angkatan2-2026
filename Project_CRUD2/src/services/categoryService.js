import API_URL from "../config/api";

const getAllCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
};

const getCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  return response.json();
};

const createCategory = async (body) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const updateCategory = async (id, body) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export default { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
