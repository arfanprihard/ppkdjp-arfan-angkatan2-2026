import { BrowserRouter, Route, Routes } from "react-router-dom";
import Content from "./components/Layouts/admin/Content";
import Dashboard from "./components/Pages/admin/Dashboard";
import UserList from "./components/Pages/admin/User/UserList";
import UserForm from "./components/Pages/admin/User/UserForm";
import MenuList from "./components/Pages/admin/Menu/MenuList";
import MenuForm from "./components/Pages/admin/Menu/MenuForm";
import RoleList from "./components/Pages/admin/Role/RoleList";
import RoleForm from "./components/Pages/admin/Role/RoleForm";
import CategoryList from "./components/Pages/admin/Category/CategoryList";
import CategoryForm from "./components/Pages/admin/Category/CategoryForm";
import ProductList from "./components/Pages/admin/Product/ProductList";
import ProductForm from "./components/Pages/admin/Product/ProductForm";
import TransactionPage from "./components/Pages/admin/Transaction/TransactionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Content />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="menus" element={<MenuList />} />
          <Route path="menus/create" element={<MenuForm />} />
          <Route path="menus/edit/:id" element={<MenuForm />} />
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/create" element={<RoleForm />} />
          <Route path="roles/edit/:id" element={<RoleForm />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/create" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="transactions" element={<TransactionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
