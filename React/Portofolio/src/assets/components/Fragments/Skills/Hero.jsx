import PageHeader from "../../Elements/PageHeader";

const Hero = () => {
  return (
    <div className="section-container">
      <div className="max-w-xl">
        <PageHeader
          eyebrow={"Technical proficiency"}
          title={"Expertise & Skills"}
          description={
            "A clear overview of the languages, frameworks, and architectural tools I leverage to build modern, high-performance software systems."
          }
        />
      </div>
    </div>
  );
};

export default Hero;
