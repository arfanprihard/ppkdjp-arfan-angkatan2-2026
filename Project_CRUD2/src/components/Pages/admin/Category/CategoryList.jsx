import { useNavigate } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import categoryService from "../../../../services/categoryService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const CategoryList = () => {
  const navigate = useNavigate();
  const { data: categories, loading, error, refetch } = useFetch(categoryService.getAllCategories);

  const columns = [
    { header: "Name", key: "name" },
  ];

  const handleEdit = (category) => {
    navigate(`/admin/categories/edit/${category.id}`);
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus category "${category.name}"?`
    );
    if (!confirmed) return;

    try {
      await categoryService.deleteCategory(category.id);
      refetch();
    } catch (err) {
      alert("Gagal menghapus category: " + (err.message || "Terjadi kesalahan"));
    }
  };

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">Category List</h1>
        <div>
          <Button onClick={() => navigate("/admin/categories/create")}>
            <i className="bx bx-plus mr-1"></i> Create Category
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        itemsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CategoryList;
