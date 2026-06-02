import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import roleService from "../../../../services/roleService";

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Fetch role data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isEdit) {
          const result = await roleService.getRoleById(id);
          const roleData = result.data?.[0] || result;
          setFormData({
            name: roleData.name || "",
            description: roleData.description || "",
            is_active: roleData.is_active !== undefined ? String(roleData.is_active) : "",
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
    if (!formData.name.trim()) newErrors.name = "Nama role wajib diisi";
    if (formData.is_active === "") newErrors.is_active = "Status wajib dipilih";
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
        description: formData.description,
        is_active: Number(formData.is_active),
      };

      if (isEdit) {
        await roleService.updateRole(id, payload);
      } else {
        await roleService.createRole(payload);
      }
      window.location.href = "/admin/roles";
    } catch (err) {
      setSubmitError(
        (isEdit ? "Gagal mengupdate role. " : "Gagal membuat role. ") +
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/roles")}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          title="Kembali"
        >
          <i className="bx bx-arrow-back text-lg text-gray-600"></i>
        </button>
        <h1 className="font-bold text-xl">
          {isEdit ? "Edit Role" : "Create Role"}
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
            <i className="bx bx-error-circle text-lg"></i>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="input-name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Nama Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-shield text-lg"></i>
              </span>
              <input
                id="input-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama role"
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

          {/* Description Field (Optional) */}
          <div>
            <label
              htmlFor="input-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Deskripsi{" "}
              <span className="text-gray-400 text-xs font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-0 flex items-start pl-3 text-gray-400">
                <i className="bx bx-notepad text-lg"></i>
              </span>
              <textarea
                id="input-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Masukkan deskripsi role"
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          {/* Is Active Field */}
          <div>
            <label
              htmlFor="input-is-active"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-toggle-left text-lg"></i>
              </span>
              <select
                id="input-is-active"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer ${
                  errors.is_active
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              >
                <option value="">-- Pilih Status --</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
                <i className="bx bx-chevron-down text-lg"></i>
              </span>
            </div>
            {errors.is_active && (
              <p className="mt-1 text-xs text-red-500">{errors.is_active}</p>
            )}
          </div>

          {/* Action Buttons */}
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
                ? "Update Role"
                : "Simpan Role"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/roles")}
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

export default RoleForm;
