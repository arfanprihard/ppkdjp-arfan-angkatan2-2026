import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Content = () => {
  return (
    <div className="bg-gray-100 h-screen flex">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="h-full">
          <Topbar />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Content;
