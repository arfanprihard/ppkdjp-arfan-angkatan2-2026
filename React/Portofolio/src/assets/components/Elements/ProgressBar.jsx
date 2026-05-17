const ProgressBar = ({ title, value = 50 }) => {
  return (
    <div>
      <div className="flex justify-between">
        {title} <div className="text-primary">{value}%</div>
      </div>
      <div className="bg-gray-400 h-2 rounded-full">
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
