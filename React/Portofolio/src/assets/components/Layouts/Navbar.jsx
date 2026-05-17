import Button from '../Elements/Button';
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-surface shadow z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-3">
        <div>
          <h1 className="font-bold text-primary text-xl">ArfanDev</h1>
        </div>
        <div className="flex gap-5">
          <a href="" className=" hover:text-primary hover:border-b hover:border-primary">
            Home
          </a>
          <a href="" className=" hover:text-primary hover:border-b hover:border-primary">
            Experience
          </a>
          <a href="" className=" hover:text-primary hover:border-b hover:border-primary">
            Projects
          </a>
          <a href="" className=" hover:text-primary hover:border-b hover:border-primary">
            Skills
          </a>
          <a href="" className=" hover:text-primary hover:border-b hover:border-primary">
            Contact
          </a>
        </div>
        <div>
          <Button className="py-1 px-3">Download CV</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
