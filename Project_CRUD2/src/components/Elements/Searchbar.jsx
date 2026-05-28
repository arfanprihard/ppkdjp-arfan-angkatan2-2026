
const Searchbar = () => {
    return (
        <div className="w-full max-w-md relative">

            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>

            <input
                type="text"
                placeholder="Search..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
            />

        </div>
    )
}

export default Searchbar
