import Card from "../../Elements/Card";

const ProjectCard = ({ image, title, desc, layout = "vertical", children }) => {
  const layouts = {
    vertical: "flex-col",
    left: "flex-row",
    right: "flex-row-reverse",
  };

  return (
    <Card
      padding="p-0"
      className={`overflow-hidden ${layouts[layout]} justify-between`}
    >
      <div>
        <div className="w-full">
          <img src={image} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 flex-1">
          <h3 className="text-2xl font-semibold mb-3">{title}</h3>

          <p>{desc}</p>
        </div>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </Card>
  );
};

export default ProjectCard;
