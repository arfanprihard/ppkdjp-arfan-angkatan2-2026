const PerformanceStats = () => {
  return (
    <div className="flex justify-center border-y-2 border-gray-400/50 bg-gray-200">
      <div className="container">
        <div className="grid md:grid-cols-4 grid-cols-2 h-50">
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl text-primary">8+</span>
            <span>YEARS EXPERIENCE</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl text-primary">142</span>
            <span>DEPLOYMENTS</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl text-primary">12K</span>
            <span>GITHUB STARS</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl text-primary">99.9%</span>
            <span>UPTIME AVERAGE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
