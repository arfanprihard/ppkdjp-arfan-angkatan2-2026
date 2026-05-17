import PageHeader from "../../Elements/PageHeader";
import { ArrowRight } from "lucide-react";
import Card from "../../Elements/Card";

const SelectedWorks = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="section-container">
        <div className="flex justify-between">
          <PageHeader eyebrow={"CASE STUDIES"} title={"Selected Works"} />
          <div className="flex justify-end flex-col pb-3">
            <span className="flex gap-2 text-primary">
              All Projects <ArrowRight />
            </span>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-3">
          <div className="lg:w-4/6">
            <Card
              background="bg-surface"
              title={"Nebula Cloud Engine"}
              tag={["React", "Java", "Jawa"]}
              image={"./jpg1.jpg"}
            />
          </div>
          <div className="lg:w-2/6">
            <Card
              background="bg-surface"
              title={"Nebula Cloud Engine"}
              tag={["React", "Java", "Jawa"]}
              desc={[
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate fugit earum exercitationem sapiente accusamus",
              ]}
              image={"./jpg1.jpg"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedWorks;
