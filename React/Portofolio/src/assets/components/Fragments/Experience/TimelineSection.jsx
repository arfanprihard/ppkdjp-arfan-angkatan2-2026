import TimelineItem from "./TimelineItem";

const TimelineSection = () => {
  return (
    <div className="lg:ml-8">
      <TimelineItem
        active
        jobTitle="Senior System Architect"
        company="@ tect_synergy solutions"
        period={"2021 - PRESENT"}
        highlights={[
          "Spearheaded the migration of monolithic infrastructure to a microservices architecture using Go and Kubernetes, reducing latency by 45%.",
          "Orchestrated a cross-functional team of 12 engineers to deliver a real-time data processing engine handling 1M+ req/sec.",
          "Implemented automated CI/CD pipelines with GitHub Actions, increasing deployment frequency from weekly to multi-daily.",
        ]}
      />
      <TimelineItem
        active={false}
        jobTitle={"Lead Full-Stack Developer"}
        company="@ nexus_core labs"
        period={"2018-2021"}
        highlights={[
          "Spearheaded the migration of monolithic infrastructure to a microservices architecture using Go and Kubernetes, reducing latency by 45%.",
          "Orchestrated a cross-functional team of 12 engineers to deliver a real-time data processing engine handling 1M+ req/sec.",
          "Implemented automated CI/CD pipelines with GitHub Actions, increasing deployment frequency from weekly to multi-daily.",
        ]}
      />
      <TimelineItem
        active={false}
        jobTitle={"Lead Full-Stack Developer"}
        company="@ nexus_core labs"
        period={"2018-2021"}
        highlights={[
          "Spearheaded the migration of monolithic infrastructure to a microservices architecture using Go and Kubernetes, reducing latency by 45%.",
          "Orchestrated a cross-functional team of 12 engineers to deliver a real-time data processing engine handling 1M+ req/sec.",
          "Implemented automated CI/CD pipelines with GitHub Actions, increasing deployment frequency from weekly to multi-daily.",
        ]}
      />
    </div>
  );
};

export default TimelineSection;
