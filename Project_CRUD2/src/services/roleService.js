import API_URL from "../config/api";

const getAllRoles = async () => {
  const response = await fetch(`${API_URL}/roles`);
  return response.json();
};

export default { getAllRoles };
