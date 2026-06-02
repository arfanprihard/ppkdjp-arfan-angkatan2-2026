import useFetch from "../../../../hooks/useFetch";
import userService from "../../../../services/userService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const UserList = () => {
  const { data: users, loading, error } = useFetch(userService.getAllUsers);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
  ];

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">User List</h1>
        <div>
          <Button>Create User</Button>
        </div>
      </div>

      <DataTable columns={columns} data={users} itemsPerPage={10} />
    </div>
  );
};

export default UserList;
