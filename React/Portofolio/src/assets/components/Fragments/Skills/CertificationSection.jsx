import { BadgeCheck } from "lucide-react";
import Card from "../../Elements/Card";
import Tag from "../../Elements/Tag";

const CertificationSection = () => {
  return (
    <div className="section-container">
      <Card padding="p-0" className="overflow-hidden">
        <div className="border-l-primary border-l-10 p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2 rounded-2xl overflow-hidden aspect-video">
              <img className="object-cover" src="jpg1.jpg" alt="" />
            </div>
            <div className="lg:w-1/2 flex flex-col justify-center gap-6">
              <div>
                <Tag
                  padding="px-3"
                  background="bg-blue-200"
                  textColor="text-blue-900"
                >
                  VERIFIED EXPERTISE
                </Tag>
              </div>
              <h1 className="font-semibold text-3xl">
                Professional Certifications
              </h1>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="text-primary bg-blue-200 rounded-full">
                    <BadgeCheck className="m-1" />
                  </div>
                  AWS Certified Solutions Architect - Professional
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-primary bg-blue-200 rounded-full">
                    <BadgeCheck className="m-1" />
                  </div>
                  Google Professional Cloud Architect
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-primary bg-blue-200 rounded-full">
                    <BadgeCheck className="m-1" />
                  </div>
                  Certified Kubernetes Administrator (CKA)
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificationSection;
