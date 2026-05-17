import ProjectCard from "./ProjectCard";

const ContentSection = () => {
  return (
    <div className="section-container">
      <div className="flex gap-7">
        <div className="lg:w-8/12">
          <ProjectCard
            title={"NovaStream Architecture"}
            image={"jpg1.jpg"}
            desc={
              "A distributed media processing engine capable of real-time transcoding and low-latency delivery. Leverages Micro-Frontends for dynamic configuration panel and a robust CI/CD pipeline for high availabity."
            }
          >
            Halo
          </ProjectCard>
        </div>
        <div className="lg:w-4/12">
          <ProjectCard title={"NovaStream Architecture"} image={"jpg1.jpg"}>
            halo
          </ProjectCard>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
