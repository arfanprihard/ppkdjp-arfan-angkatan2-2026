import PageHeader from "../../Elements/PageHeader";

const Hero = () => {
  return (
    <div className="section-container mb-15">
      <div className="max-w-2xl">
        <PageHeader
          eyebrow={"System.init_communication()"}
          title={"Get in touch."}
          description={
            "Whether you have a specific project in mind, a technical question, or just want to talk shop about system architecture, my inbox is always open."
          }
        />
      </div>
    </div>
  );
};

export default Hero;
