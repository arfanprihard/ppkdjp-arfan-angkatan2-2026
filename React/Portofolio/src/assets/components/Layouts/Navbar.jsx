import Button from '../Elements/Button';
const Navbar = () => {
  return (
    <nav className="py-3 shadow justify-center flex">
      <div className="flex items-center justify-between container">
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
