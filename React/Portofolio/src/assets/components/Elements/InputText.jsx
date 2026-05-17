const InputText = ({
  title,
  type = "text",
  placeholder,
  className = "",
  textarea = false,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {title && <label>{title}</label>}

      {textarea ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`border-2 border-gray-400/70 rounded-lg px-4 py-2 w-full bg-gray-200 focus:outline-none focus:border-primary ${className}`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`border-2 border-gray-400/70 rounded-lg px-4 py-2 w-full bg-gray-200 focus:outline-nonefocus:border-primary ${className}`}
        />
      )}
    </div>
  );
};

export default InputText;
