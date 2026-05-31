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
          <div className="w-full p-7 max-w-500 mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
