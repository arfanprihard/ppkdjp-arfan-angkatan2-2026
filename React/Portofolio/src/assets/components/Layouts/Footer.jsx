import Tag from '../Elements/Tag';

const Footer = () => {
  return (
    <div className="px-4 h-30 bg-white mt-10 shadow-xl flex justify-center border-t-2 border-gray-200">
      <div className="container flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium text-[18px]">© 2025 Dev_Arf</span>
          <span className="text-[13px] font-light">BUILT WITH PRECISION & ACADEMIC CLARITY</span>
        </div>
        <div className="gap-4 flex">
          <a href="">Github</a>
          <a href="">LinkedIn</a>
          <a href="">Docs</a>
        </div>
        <div className="hidden md:block">
          <Tag>SYSTEM OPERATIONAL</Tag>
        </div>
      </div>
    </div>
  );
};

export default Footer;
