import { useNavigate } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import productService from "../../../../services/productService";
import Button from "../../../Elements/Button";
import DataTable from "../../../Fragments/DataTable";

const ProductList = () => {
  const navigate = useNavigate();
  const { data: products, loading, error, refetch } = useFetch(productService.getAllProducts);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Category", key: "category_name" },
    {
      header: "Price",
      render: (item) => (
        <span>Rp {Number(item.price).toLocaleString("id-ID")}</span>
      ),
    },
    { header: "Qty", key: "qty", className: "text-center", cellClassName: "text-center" },
    { header: "Unit", key: "unit" },
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

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus product "${product.name}"?`
    );
    if (!confirmed) return;

    try {
      await productService.deleteProduct(product.id);
      refetch();
    } catch (err) {
      alert("Gagal menghapus product: " + (err.message || "Terjadi kesalahan"));
    }
  };

  if (loading) return <p className="text-center py-10">Loading data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl mb-5">Product List</h1>
        <div>
          <Button onClick={() => navigate("/admin/products/create")}>
            <i className="bx bx-plus mr-1"></i> Create Product
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        itemsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductList;
