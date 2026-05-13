const Tag = ({ children }) => {
  return (
    <span className="border-2 rounded-full py-1 px-2 text-sm font-bold text-primary bg-primary/10 border-primary/20">
      {children}
    </span>
  );
};

export default Tag;
