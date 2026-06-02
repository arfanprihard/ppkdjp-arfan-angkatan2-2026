import { useEffect, useState } from "react";
import SidebarMenu from "../../Elements/SidebarMenu";
import menuService from "../../../services/menuService";
const Sidebar = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const loadMenus = async () => {
      const result = await menuService.getAllMenus();
      console.log(result.data);
      setMenus(result.data);
    };
    loadMenus();
  }, []);

  const buildMenuTree = (menus) => {
    const activeMenus = menus.filter((menu) => menu.is_active);
    const parents = activeMenus.filter((menu) => !menu.id_parent);
    return parents.map((parent) => ({
      ...parent,
      children: activeMenus.filter((menu) => menu.id_parent === parent.id),
    }));
  };

  const menuTree = menus.length > 0 ? buildMenuTree(menus) : [];

  return (
    <div className="h-full w-65 bg-white border-r border-gray-300">
      <div className="h-20 pl-10 w-full flex justify-start items-center">
        <img src="/logo-indomaret.png" alt="" width="150px" />
      </div>
      <div className="mx-4 gap-1 flex flex-col">
        <p className="text-sm font-light opacity-50 ml-3 my-3">Menu</p>
        {menuTree.map((menu, index) => (
          <SidebarMenu
            key={index}
            icon={menu.icon}
            url={menu.url}
            subMenus={menu.children}
          >
            {menu.name}
          </SidebarMenu>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
