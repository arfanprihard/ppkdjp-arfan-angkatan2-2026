import Hero from "./Hero";
import TimelineSection from "./TimelineSection";

const WorkHistorySection = () => {
  return (
    <div className="section-container mb-15">
      <div className="flex lg:flex-row flex-col">
        <div className="lg:w-4/12 lg:border-r-2 lg:border-black/20 top-0">
          <Hero />
        </div>
        <div className="lg:w-8/12 top-0">
          <TimelineSection />
        </div>
      </div>
    </div>
  );
};

export default WorkHistorySection;
