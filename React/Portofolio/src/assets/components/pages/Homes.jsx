import PerformanceStats from '../Layouts/PerformanceStats';
import Profile from '../Layouts/Profile';
import SelectedWorks from '../Layouts/SelectedWorks';

const Homes = () => {
  return (
    <div className="mt-10">
      <Profile />
      <PerformanceStats />
      <SelectedWorks />
    </div>
  );
};

export default Homes;
