import ResumeSection from "../Fragments/Experience/ResumeSection";
import WorkHistorySection from "../Fragments/Experience/WorkHistorySection";
import MainLayout from "../Layouts/MainLayout";

const Experience = () => {
  return (
    <MainLayout>
      <WorkHistorySection />
      <ResumeSection />
    </MainLayout>
  );
};

export default Experience;
