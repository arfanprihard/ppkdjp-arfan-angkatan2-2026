
const Button = ({ children, onClick, ...props }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition cursor-pointer"
            {...props}
        >
            {children}
        </button>
    )
}

export default Button

