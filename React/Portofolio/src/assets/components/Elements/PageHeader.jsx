const PageHeader = ({
  eyebrow,
  title,
  description,
  name,
  role,
  titleSize = "text-3xl",
}) => {
  return (
    <div>
      {eyebrow && (
        <p className="uppercase font-bold text-primary mb-2">{eyebrow}</p>
      )}
      {title && <h1 className={`${titleSize} mb-4 font-bold`}>{title}</h1>}
      <div className="tracking-wide mb-4">
        {name && <h1 className="lg:text-6xl text-4xl font-bold">{name}</h1>}
        {role && (
          <h1 className="lg:text-6xl text-4xl font-bold text-primary">
            {role}
          </h1>
        )}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
};

export default PageHeader;
