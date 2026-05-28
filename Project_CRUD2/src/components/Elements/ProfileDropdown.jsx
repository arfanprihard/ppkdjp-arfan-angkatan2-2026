import { useState } from "react";

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Button Profile */}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 cursor-pointer select-none"
            >
                <img
                    src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                />

                <p className="font-medium">Arfan</p>

                <i
                    className={`bx bx-chevron-down text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                ></i>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">

                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition">
                        <i className="bx bx-user text-lg"></i>
                        <span>My Profile</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition">
                        <i className="bx bx-cog text-lg"></i>
                        <span>Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 transition">
                        <i className="bx bx-log-out text-lg"></i>
                        <span>Logout</span>
                    </button>

                </div>
            )}

        </div>
    );
};

export default ProfileDropdown;