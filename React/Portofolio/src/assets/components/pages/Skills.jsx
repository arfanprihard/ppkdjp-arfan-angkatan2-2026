import CertificationSection from "../Fragments/Skills/CertificationSection";
import ExpertiseSkillsSection from "../Fragments/Skills/ExpertiseSkillsSection";
import Hero from "../Fragments/Skills/Hero";
import MainLayout from "../Layouts/MainLayout";

const Skills = () => {
  return (
    <MainLayout>
      <Hero />
      <ExpertiseSkillsSection />
      <CertificationSection />
    </MainLayout>
  );
};

export default Skills;
