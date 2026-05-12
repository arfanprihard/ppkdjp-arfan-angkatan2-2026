const PageHeader = ({ eyebrow, title, description, name, role }) => {
  return (
    <div>
      {eyebrow && <p className="uppercase font-bold text-primary mb-2">{eyebrow}</p>}
      {title && <h1 className="text-2xl mb-4 font-medium">{title}</h1>}
      <div className="tracking-wide mb-4">
        {name && <h1 className="lg:text-6xl text-4xl font-bold">{name}</h1>}
        {role && <h1 className="lg:text-6xl text-4xl font-bold text-primary">{role}</h1>}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
};

export default PageHeader;
