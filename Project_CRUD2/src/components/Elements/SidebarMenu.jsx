import { useLocation } from "react-router-dom";
const SidebarMenu = ({ children, icon, url }) => {
    const location = useLocation();
    const isActive = location.pathname === url;
    return (
        <div className={`${isActive ? "bg-blue-200 text-blue-600" : "text-taupe-600"} h-10 flex justify-start gap-3 items-center text-md  font-semibold hover:bg-gray-100 cursor-pointer rounded-md px-5`}>
            <i className={`${icon} text-xl`}></i>
            {children}
        </div>
    )
}

export default SidebarMenu
