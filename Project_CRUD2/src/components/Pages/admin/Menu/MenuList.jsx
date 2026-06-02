import { useNavigate } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import menuService from "../../../../services/menuService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const MenuList = () => {
  const navigate = useNavigate();
  const { data: menus, loading, error, refetch } = useFetch(menuService.getAllMenus);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Parent", key: "parent_name" },
    { header: "Url", key: "url" },
    { header: "Icon", key: "icon" },
    { header: "Sort Order", key: "sort_order" },
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

  const handleEdit = (menu) => {
    navigate(`/admin/menus/edit/${menu.id}`);
  };

  const handleDelete = async (menu) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus menu "${menu.name}"?`
    );
    if (!confirmed) return;

    try {
      await menuService.deleteMenu(menu.id);
      refetch();
    } catch (err) {
      alert("Gagal menghapus menu: " + (err.message || "Terjadi kesalahan"));
    }
  };

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">Menu List</h1>
        <div>
          <Button onClick={() => navigate("/admin/menus/create")}>
            <i className="bx bx-plus mr-1"></i> Create Menu
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={menus}
        itemsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MenuList;
