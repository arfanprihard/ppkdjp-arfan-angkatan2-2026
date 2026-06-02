import { useNavigate } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import userService from "../../../../services/userService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const UserList = () => {
  const navigate = useNavigate();
  const { data: users, loading, error, refetch } = useFetch(userService.getAllUsers);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
  ];

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus user "${user.name}"?`
    );
    if (!confirmed) return;

    try {
      await userService.deleteUser(user.id);
      refetch();
    } catch (err) {
      alert("Gagal menghapus user: " + (err.message || "Terjadi kesalahan"));
    }
  };

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">User List</h1>
        <div>
          <Button onClick={() => navigate("/admin/users/create")}>
            <i className="bx bx-plus mr-1"></i> Create User
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        itemsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserList;
