import API_URL from "../config/api";

const getAllRoles = async () => {
  const response = await fetch(`${API_URL}/roles`);
  return response.json();
};

const getRoleById = async (id) => {
  const response = await fetch(`${API_URL}/roles/${id}`);
  return response.json();
};

const createRole = async (body) => {
  const response = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const updateRole = async (id, body) => {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const deleteRole = async (id) => {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export default { getAllRoles, getRoleById, createRole, updateRole, deleteRole };
