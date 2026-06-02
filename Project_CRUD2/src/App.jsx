import { BrowserRouter, Route, Routes } from "react-router-dom";
import Content from "./components/Layouts/admin/Content";
import Dashboard from "./components/Pages/admin/Dashboard";
import UserList from "./components/Pages/admin/User/UserList";
import MenuList from "./components/Pages/admin/Menu/MenuList";
import RoleList from "./components/Pages/admin/Role/RoleList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Content />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="menus" element={<MenuList />} />
          <Route path="roles" element={<RoleList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
