import ContentSection from "../Fragments/Projects/ContentSection";
import Hero from "../Fragments/Projects/Hero";
import MainLayout from "../Layouts/MainLayout";

const Projects = () => {
  return (
    <div>
      <MainLayout>
        <Hero />
        <ContentSection />
      </MainLayout>
    </div>
  );
};

export default Projects;
