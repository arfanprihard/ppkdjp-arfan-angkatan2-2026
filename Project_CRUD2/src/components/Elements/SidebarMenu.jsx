
const SidebarMenu = ({ children, icon, url }) => {
    return (
        <div className="h-10 flex justify-start gap-3 items-center text-md text-taupe-600 font-semibold hover:bg-gray-100 cursor-pointer rounded-md px-5">
            <i className={`${icon} text-xl`}></i>
            {children}
        </div>
    )
}

export default SidebarMenu
