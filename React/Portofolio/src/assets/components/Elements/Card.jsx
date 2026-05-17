import Tag from "./Tag";

const Card = ({
  background = "bg-surface-secondary",
  image,
  tag = [],
  title,
  desc,
  padding = "p-10",
  children,
  icon,
  rounded = "rounded-2xl",
  className,
}) => {
  return (
    <div
      className={`${background} ${padding} flex flex-col ${rounded} border-2 border-gray-300 shadow-sm h-full ${className}`}
    >
      {(icon || title) && (
        <div className="text-xl font-semibold mb-8 flex items-center gap-3">
          {icon}
          {title && <span>{title}</span>}
        </div>
      )}

      {tag.length > 0 && (
        <div className="flex gap-2 mb-4">
          {tag.map((value, index) => (
            <Tag key={index}>{value}</Tag>
          ))}
        </div>
      )}
      {desc && <p className="mb-5">{desc}</p>}
      {image && (
        <img
          className="rounded-2xl w-full h-full object-cover"
          src={image}
          alt=""
        />
      )}
      {children}
    </div>
  );
};

export default Card;
