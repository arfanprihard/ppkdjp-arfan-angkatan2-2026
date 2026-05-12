import Tag from '../Elements/Tag';

const Card = ({ background = 'bg-surface-secondary', image, tag = [], title, desc }) => {
  return (
    <div className={`${background} p-10 flex flex-col rounded-2xl border-2 border-gray-300 shadow`}>
      <span className="text-2xl">{title}</span>
      <div className="flex gap-2">
        {tag.map((value, index) => (
          <Tag key={index}>{value}</Tag>
        ))}
      </div>
      {desc && <p>{desc}</p>}
      {image && <img className="rounded-2xl" src={image} alt="" />}
    </div>
  );
};

export default Card;
