const Button = ({
  children,
  icon,
  rightIcon,
  variant = "primary",
  className = "py-3 px-3",
}) => {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90 rounded-lg",

    outline:
      "border border-primary text-blue-600 bg-white hover:bg-gray-200 rounded-lg",

    soft: "bg-white border border-gray-300 shadow-sm hover:bg-gray-200 w-full justify-between rounded-lg",
  };

  return (
    <button
      className={`flex items-center transition cursor-pointer ${variants[variant]} ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon && <span>{icon}</span>}
        {children}
      </div>

      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
