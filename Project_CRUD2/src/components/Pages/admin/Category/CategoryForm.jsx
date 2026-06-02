import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryService from "../../../../services/categoryService";

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isEdit) {
          const result = await categoryService.getCategoryById(id);
          const categoryData = result.data?.[0] || result;
          setFormData({
            name: categoryData.name || "",
          });
        }
      } catch (err) {
        setSubmitError("Gagal memuat data. " + (err.message || ""));
      } finally {
        setLoadingPage(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama category wajib diisi";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
      };

      if (isEdit) {
        await categoryService.updateCategory(id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      window.location.href = "/admin/categories";
    } catch (err) {
      setSubmitError(
        (isEdit ? "Gagal mengupdate category. " : "Gagal membuat category. ") +
          (err.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/categories")}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          title="Kembali"
        >
          <i className="bx bx-arrow-back text-lg text-gray-600"></i>
        </button>
        <h1 className="font-bold text-xl">
          {isEdit ? "Edit Category" : "Create Category"}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
            <i className="bx bx-error-circle text-lg"></i>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="input-name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Nama Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-category text-lg"></i>
              </span>
              <input
                id="input-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama category"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              )}
              <i className={`bx ${isEdit ? "bx-check" : "bx-plus"} text-lg`}></i>
              {loading
                ? "Menyimpan..."
                : isEdit
                ? "Update Category"
                : "Simpan Category"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="bg-gray-100 text-gray-600 py-2.5 px-6 rounded-lg hover:bg-gray-200 transition cursor-pointer text-sm font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
