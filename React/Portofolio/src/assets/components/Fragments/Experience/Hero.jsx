import PageHeader from "../../Elements/PageHeader";
import Tag from "../../Elements/Tag";

const Hero = () => {
  return (
    <div className="mr-20 mb-15">
      <PageHeader
        eyebrow={">System.init(experience)"}
        title={
          <>
            Work <br />
            History.
          </>
        }
        titleSize={"text-5xl"}
        description={
          "A chonicle of technical leadership and architectural decission across high-performance engineering teams."
        }
      />

      <div className="flex flex-wrap gap-2 mt-4">
        <Tag background="bg-gray-200" textColor="text-black/75">
          Distributed Systems
        </Tag>
        <Tag background="bg-gray-200" textColor="text-black/75">
          Cloud Architecture
        </Tag>
        <Tag background="bg-gray-200" textColor="text-black/75">
          Team Leadership
        </Tag>
      </div>
    </div>
  );
};

export default Hero;
