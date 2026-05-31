import { BrowserRouter, Route, Routes } from "react-router-dom"
import Content from "./components/Layouts/admin/Content"
import Dashboard from "./components/Pages/admin/Dashboard"
import ListPage from "./components/Pages/admin/User/ListPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Content />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
