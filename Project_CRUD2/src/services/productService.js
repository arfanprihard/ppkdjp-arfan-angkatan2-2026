import API_URL from "../config/api";

const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
};

const createProduct = async (body) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const updateProduct = async (id, body) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
