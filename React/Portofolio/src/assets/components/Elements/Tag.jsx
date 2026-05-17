const Tag = ({
  children,
  textColor = "text-black/70",
  borderColor = "border-gray-300",
  background = "bg-gray-200",
  rounded = "rounded-full",
  text = "text-sm",
  padding = "py-1 px-2",
}) => {
  return (
    <span
      className={`border-2 ${rounded} ${padding} ${text} font-bold ${background} ${borderColor} ${textColor}`}
    >
      {children}
    </span>
  );
};

export default Tag;
