import Card from "../../Elements/Card";
import {
  CodeXml,
  Layers2,
  Terminal,
  Cloud,
  Box,
  GitBranch,
  ChartNoAxesColumnIncreasing,
  Database,
} from "lucide-react";
import ProgressBar from "../../Elements/ProgressBar";
import Tag from "../../Elements/Tag";

const ExpertiseSkillsSection = () => {
  return (
    <div className="section-container mt-10 mb-15">
      <div className="flex lg:flex-row flex-col gap-4 mb-5">
        <div className="lg:w-8/12">
          <Card
            icon={<CodeXml className="text-primary" />}
            title={"Core Languages"}
          >
            <div className="space-y-8">
              <div className="flex gap-10">
                <div className="w-1/2">
                  <ProgressBar title={"TypeSript / Node.js"} value={90} />
                </div>
                <div className="w-1/2">
                  <ProgressBar title={"TypeSript / Node.js"} value={90} />
                </div>
              </div>
              <div className="flex gap-10">
                <div className="w-1/2">
                  <ProgressBar title={"TypeSript / Node.js"} value={90} />
                </div>
                <div className="w-1/2">
                  <ProgressBar title={"TypeSript / Node.js"} value={90} />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:w-4/12">
          <Card
            icon={<Layers2 className="text-primary" />}
            background="bg-gray-200"
            title={"Frameworks"}
          >
            <div className="space-y-4 pb-10 border-b-2 border-gray-300">
              <div className="space-x-2">
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  React.js
                </Tag>
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  Next.js
                </Tag>
              </div>
              <div className="space-x-2">
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  Tailwind CSS
                </Tag>
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  Redux
                </Tag>
              </div>
              <div className="space-x-2">
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  GraphQL
                </Tag>
                <Tag
                  rounded="rounded-md"
                  borderColor="border-teal-400"
                  background="bg-teal-200"
                  text="text-teal-600"
                >
                  Prisma
                </Tag>
              </div>
            </div>
            <div className="mt-8">
              <p className="italic text-gray-500 text-sm font-medium">
                Focused on building accessible, high-performance student-centric
                interfaces.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="lg:w-6/12">
          <Card
            icon={<Terminal className="text-primary" />}
            title={"Cloud & DevOps"}
            background="bg-gray-200"
          >
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="flex gap-4">
                  <Cloud />
                  <h1 className="font-semibold">AWS / GCP</h1>
                </div>
                <h2 className="ml-10 font-light">Cloud Architecture</h2>
              </div>
              <div>
                <div className="flex gap-4">
                  <Box />
                  <h1 className="font-semibold">Docker / K8s</h1>
                </div>
                <h2 className="ml-10 font-light">Containerization</h2>
              </div>
              <div>
                <div className="flex gap-4">
                  <GitBranch />
                  <h1 className="font-semibold">Terraform</h1>
                </div>
                <h2 className="ml-10 font-light">Insfrastructure</h2>
              </div>
              <div>
                <div className="flex gap-4">
                  <ChartNoAxesColumnIncreasing />
                  <h1 className="font-semibold">CI / CD</h1>
                </div>
                <h2 className="ml-10 font-light">Deployment</h2>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:w-6/12">
          <Card
            icon={<Database className="text-primary" />}
            title={"Data Systems"}
            background="bg-gray-200"
          >
            <div className="flex flex-col gap-4">
              <div>
                <Card padding="p-4" rounded="rounded-md">
                  <div className="flex justify-between font-medium">
                    PostgreSQL / MySQL
                    <Tag
                      text="text-[10px]"
                      borderColor="border-blue-100"
                      background="bg-blue-100"
                      textColor="text-blue-900"
                    >
                      RELATIONAL
                    </Tag>
                  </div>
                </Card>
              </div>
              <div>
                <Card padding="p-4" rounded="rounded-md">
                  <div className="flex justify-between font-medium">
                    MongoDB / Redis
                    <Tag
                      text="text-[10px]"
                      borderColor="border-green-100"
                      background="bg-green-100"
                      textColor="text-green-900"
                    >
                      NOSQL
                    </Tag>
                  </div>
                </Card>
              </div>
              <div>
                <Card padding="p-4" rounded="rounded-md">
                  <div className="flex justify-between font-medium ">
                    Apache Kafka
                    <Tag
                      text="text-[10px]"
                      borderColor="border-fuchsia-100"
                      background="bg-fuchsia-100"
                      textColor="text-fuchsia-900"
                    >
                      STREAMING
                    </Tag>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseSkillsSection;
