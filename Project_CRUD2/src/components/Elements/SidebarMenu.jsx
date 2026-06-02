import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarMenu = ({ children, icon, url, subMenus = [] }) => {
  const location = useLocation();
  const isActive = location.pathname === url;
  const hasChildren = subMenus.length > 0;
  const hasActiveChild = subMenus.some((sub) => location.pathname === sub.url);
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const navigate = useNavigate();
  if (hasChildren) {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`${isActive ? "bg-blue-200 text-blue-600" : "text-taupe-600"} h-10 flex justify-between items-center text-sm font-semibold hover:bg-gray-100 cursor-pointer rounded-md px-5`}
        >
          <div className="flex items-center gap-3">
            <i className={`${icon} text-xl`}></i>
            {children}
          </div>
          <i
            className={`bx bx-chevron-down text-lg transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          ></i>
        </div>
        {isOpen && (
          <div className="ml-6 flex flex-col gap-1 mt-1">
            {subMenus.map((sub, index) => (
              <SidebarMenu key={index} icon={sub.icon} url={sub.url}>
                {sub.name}
              </SidebarMenu>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(url)}
      className={`${isActive ? "bg-blue-200 text-blue-600" : "text-taupe-600"} h-10 flex justify-start gap-3 items-center text-sm font-semibold hover:bg-gray-100 cursor-pointer rounded-md px-5`}
    >
      <i className={`${icon} text-xl`}></i>
      {children}
    </div>
  );
};

export default SidebarMenu;
