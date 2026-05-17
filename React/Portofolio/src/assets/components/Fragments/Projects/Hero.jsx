import PageHeader from "../../Elements/PageHeader";

const Hero = () => {
  return (
    <div className="section-container mb-15">
      <div className="w-150">
        <PageHeader
          eyebrow={"SHOWCASE / INVENTORY"}
          title={
            <>
              Selected Works &{" "}
              <span className="text-primary">Engineering </span>
              Architectures
            </>
          }
          description={
            "A Collection of high-performance systems and interactive applications built with precision, focus, and a commitment to scalable architecture."
          }
        />
      </div>
    </div>
  );
};

export default Hero;
