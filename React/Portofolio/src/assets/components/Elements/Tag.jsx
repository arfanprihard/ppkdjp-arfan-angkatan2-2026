const Tag = ({ children }) => {
  return (
    <span className="border-2 rounded-full p-2 text-sm font-bold text-primary bg-primary/10 border-primary/20">
      {children}
    </span>
  );
};

export default Tag;
