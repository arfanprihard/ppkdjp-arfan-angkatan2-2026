/**
 *
 * @param {{
 *  variant?: "primary" | "outline",
 * }} param0
 * @returns
 */

const Button = ({ children, icon, variant = 'primary', className = 'py-3 px-3' }) => {
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    outline: 'border border-gray-300 text-blue-600 bg-white hover:bg-gray-100',
  };

  return (
    <button
      className={`flex items-center gap-2 rounded-md transition ${className} ${variants[variant]}`}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default Button;
