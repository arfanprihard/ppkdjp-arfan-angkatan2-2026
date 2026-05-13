import Footer from './Footer';
import Navbar from './Navbar';
const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="mt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
