import { useState, useEffect } from "react"
import userService from "../../../../services/userService"
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const ListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const result = await userService.getAllUsers();
      setUsers(result.data);
    }
    loadUsers();
  }, []);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
    {
      header: "Action",
      className: "text-center",
      cellClassName: "text-center text-xl",
      render: (user) => (
        <div className="flex justify-center gap-2">
          <i className="bx bx-edit cursor-pointer text-green-700 hover:scale-110"></i>
          <i className="bx bx-trash cursor-pointer text-red-500 hover:scale-110"></i>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">
          User List
        </h1>
        <div>
          <Button>
            Create User
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={users} itemsPerPage={10} />
    </div>
  )
}

export default ListPage
