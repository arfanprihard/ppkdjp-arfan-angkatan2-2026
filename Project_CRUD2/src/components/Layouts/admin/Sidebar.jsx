import SidebarMenu from "../../Elements/SidebarMenu";
const Sidebar = () => {
    return (
        <div className="h-full w-65 bg-white border-r border-gray-300">
            <div className="h-20 pl-10 w-full flex justify-start items-center">
                <img src="/logo-indomaret.png" alt="" width="150px" />
            </div>
            <div className="mx-4 gap-1 flex flex-col">
                <p className="text-sm font-light opacity-50 ml-3 my-3">
                    Menu
                </p>
                <SidebarMenu icon="bx bx-user" url="/admin/users">
                    User
                </SidebarMenu>
                <SidebarMenu icon="bx bx-user">
                    User
                </SidebarMenu>
            </div>
        </div>
    )
}

export default Sidebar
