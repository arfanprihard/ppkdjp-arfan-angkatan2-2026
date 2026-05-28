import ProfileDropdown from "../../Elements/ProfileDropdown"
import Searchbar from "../../Elements/Searchbar"

const Topbar = () => {
    return (
        <div className="px-10 h-25 w-full bg-white border-b-2 border-gray-300 flex justify-between items-center">
            <Searchbar />
            <ProfileDropdown />
        </div>
    )
}

export default Topbar
