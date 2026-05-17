import PerformanceStats from '../Fragments/Home/PerformanceStats';
import Profile from '../Fragments/Home/Profile';
import SelectedWorks from '../Fragments//Home/SelectedWorks';
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
