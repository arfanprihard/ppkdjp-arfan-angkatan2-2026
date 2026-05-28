import { BrowserRouter, Route, Routes } from "react-router-dom"
import Content from "./components/Layouts/admin/Content"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Content />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
