import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../../../services/userService";
import roleService from "../../../../services/roleService";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Fetch roles & user data (if editing)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load roles
        const rolesResult = await roleService.getAllRoles();
        setRoles(rolesResult.data || rolesResult);

        // Load user data if editing
        if (isEdit) {
          const userResult = await userService.getUserById(id);
          const userData =
            userResult.id?.[0] || userResult.data?.[0] || userResult;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            password: "",
            role_id: userData.role_id || "",
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
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!isEdit && !formData.password.trim())
      newErrors.password = "Password wajib diisi";
    if (!formData.role_id) newErrors.role_id = "Role wajib dipilih";
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
      const payload = { ...formData };
      // If editing and password is empty, remove it from payload
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await userService.updateUser(id, payload);
      } else {
        await userService.createUser(payload);
      }
      window.location.href = "/admin/users";
    } catch (err) {
      setSubmitError(
        (isEdit ? "Gagal mengupdate user. " : "Gagal membuat user. ") +
          (err.message || ""),
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
          onClick={() => navigate("/admin/users")}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          title="Kembali"
        >
          <i className="bx bx-arrow-back text-lg text-gray-600"></i>
        </button>
        <h1 className="font-bold text-xl">
          {isEdit ? "Edit User" : "Create User"}
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
              Nama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-user text-lg"></i>
              </span>
              <input
                id="input-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
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

          {/* Email Field */}
          <div>
            <label
              htmlFor="input-email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-envelope text-lg"></i>
              </span>
              <input
                id="input-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="input-password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password {!isEdit && <span className="text-red-500">*</span>}
              {isEdit && (
                <span className="text-gray-400 text-xs font-normal">
                  (Kosongkan jika tidak ingin mengubah)
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-lock-alt text-lg"></i>
              </span>
              <input
                id="input-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEdit
                    ? "Masukkan password baru (opsional)"
                    : "Masukkan password"
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="input-role"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="bx bx-shield text-lg"></i>
              </span>
              <select
                id="input-role"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer ${
                  errors.role_id
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              >
                <option value="">-- Pilih Role --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
                <i className="bx bx-chevron-down text-lg"></i>
              </span>
            </div>
            {errors.role_id && (
              <p className="mt-1 text-xs text-red-500">{errors.role_id}</p>
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
              <i
                className={`bx ${isEdit ? "bx-check" : "bx-plus"} text-lg`}
              ></i>
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Update User"
                  : "Simpan User"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
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

export default UserForm;
