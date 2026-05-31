import API_URL from "../config/api";

const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  return response.json();
};

const createUser = async (body) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const updateUser = async (id, body) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
