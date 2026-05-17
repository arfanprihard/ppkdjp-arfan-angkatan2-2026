import Tag from "../Elements/Tag";

const Footer = () => {
  return (
    <footer className="bg-white mt-10 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 min-h-30 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-[18px]">© 2025 Dev_Arf</span>

          <span className="text-[13px] font-light">
            BUILT WITH PRECISION & ACADEMIC CLARITY
          </span>
        </div>

        <div className="flex gap-4">
          <a href="">Github</a>
          <a href="">LinkedIn</a>
          <a href="">Docs</a>
        </div>

        <div className="hidden md:block">
          <Tag>SYSTEM OPERATIONAL</Tag>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
