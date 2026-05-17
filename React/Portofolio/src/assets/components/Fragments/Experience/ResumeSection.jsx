import Card from "../../Elements/Card";
import { GraduationCap } from "lucide-react";
import { Award } from "lucide-react";
import { SquareChevronRight } from "lucide-react";
import Tag from "../../Elements/Tag";

const ResumeSection = () => {
  return (
    <div className="section-container mb-20">
      <div className="flex lg:flex-row flex-col gap-5">
        <div className="lg:w-2/6">
          <Card
            icon={<GraduationCap className="text-primary" />}
            title={"Education"}
          >
            <div className="space-y-1">
              <div className="font-semibold">M.S. Computer Science</div>
              <div className="text-primary font-semibold">
                Stanford University
              </div>
              <div>Specialization in AI & Distributed Computing</div>
            </div>
          </Card>
        </div>
        <div className="lg:w-2/6">
          <Card
            icon={<Award className="text-primary" />}
            title={"Certifications"}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                AWS Solutions Architect
                <Tag
                  background="bg-fuchsia-200"
                  textColor="text-fuchsia-900"
                  borderColor="border-fuchsia-900/20"
                  rounded="rounded-md"
                  text="text-[12px]"
                  padding="py-0 px-2"
                >
                  PRO
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                CKA Kubernetes Admin
                <Tag
                  background="bg-green-200"
                  textColor="text-green-900"
                  borderColor="border-green-900/20"
                  rounded="rounded-md"
                  text="text-[12px]"
                  padding="py-0 px-2"
                >
                  CERT
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                Google Cloud Professional
                <Tag
                  background="bg-fuchsia-200"
                  textColor="text-fuchsia-900"
                  borderColor="border-fuchsia-900/20"
                  rounded="rounded-md"
                  text="text-[12px]"
                  padding="py-0 px-2"
                >
                  PRO
                </Tag>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:w-2/6">
          <Card
            icon={<SquareChevronRight className="text-primary" />}
            title={"Tooling"}
          >
            <div className="flex flex-wrap gap-2">
              <Tag rounded="rounded-sm" text="text-[13px]">
                Terraform
              </Tag>
              <Tag rounded="rounded-sm" text="text-[13px]">
                Docker
              </Tag>
              <Tag rounded="rounded-sm" text="text-[13px]">
                Prometheus
              </Tag>
              <Tag rounded="rounded-sm" text="text-[13px]">
                Redis
              </Tag>
              <Tag rounded="rounded-sm" text="text-[13px]">
                GraphQL
              </Tag>
              <Tag rounded="rounded-sm" text="text-[13px]">
                PostgreSQL
              </Tag>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeSection;
