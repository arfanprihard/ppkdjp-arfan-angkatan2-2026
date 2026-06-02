import useFetch from "../../../../hooks/useFetch";
import roleService from "../../../../services/roleService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const RoleList = () => {
  const { data: roles, loading, error } = useFetch(roleService.getAllRoles);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Description", key: "description" },

    {
      header: "Status",
      className: "text-center",
      cellClassName: "text-center",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">Role List</h1>
        <div>
          <Button>Create Role</Button>
        </div>
      </div>

      <DataTable columns={columns} data={roles} itemsPerPage={10} />
    </div>
  );
};

export default RoleList;
