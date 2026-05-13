import PerformanceStats from '../Fragments/PerformanceStats';
import Profile from '../Fragments/Profile';
import SelectedWorks from '../Fragments/SelectedWorks';
import MainLayout from '../Layouts/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <Profile />
      <PerformanceStats />
      <SelectedWorks />
    </MainLayout>
  );
};

export default Home;
