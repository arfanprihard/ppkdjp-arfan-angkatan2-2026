import Tag from '../Elements/Tag';

const Card = ({ background = 'bg-surface-secondary', image, tag = [], title, desc }) => {
  return (
    <div
      className={`${background} p-10 flex flex-col gap-3 rounded-2xl border-2 border-gray-300 shadow-xl h-full`}
    >
      {title && <span className="text-2xl font-bold">{title}</span>}
      {tag && (
        <div className="flex gap-2 mb-4">
          {tag.map((value, index) => (
            <Tag key={index}>{value}</Tag>
          ))}
        </div>
      )}
      {desc && <p className="mb-5">{desc}</p>}
      {image && <img className="rounded-2xl w-full h-full object-cover" src={image} alt="" />}
    </div>
  );
};

export default Card;
