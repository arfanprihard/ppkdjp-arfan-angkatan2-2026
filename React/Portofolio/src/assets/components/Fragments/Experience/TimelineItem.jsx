import Card from "../../Elements/Card";

const TimelineItem = ({
  active = false,
  jobTitle,
  company,
  period,
  highlights = [],
}) => {
  return (
    <div className="pb-15">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full ${active ? `bg-primary` : `bg-gray-400`}`}
            />
          </div>
          <h1 className="font-medium text-2xl ml-4">{jobTitle}</h1>
        </div>
        <span className="text-sm font-bold text-gray-600">{period}</span>
      </div>
      <h2 className="uppercase text-primary font-bold text-md ml-10 mb-5">
        {company}
      </h2>
      <div>
        <Card padding="p-4">
          <ul className="space-y-3">
            {highlights.length > 0 &&
              highlights.map((value, index) => (
                <li className="flex gap-2" key={index}>
                  <div>/</div>
                  {value}
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default TimelineItem;
