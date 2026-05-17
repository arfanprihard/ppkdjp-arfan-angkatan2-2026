import Card from "../../Elements/Card";
import Button from "../../Elements/Button";
import InputText from "../../Elements/InputText";
import {
  SendHorizontal,
  Share2,
  SquareTerminal,
  AtSign,
  ArrowRight,
} from "lucide-react";

const ContentSection = () => {
  return (
    <div className="section-container">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex">
          <Card className="flex-1 gap-5">
            <div className="flex gap-4">
              <div className="w:1/2">
                <InputText title={"NAME"} placeholder={"Jhon Doe"} />
              </div>
              <div className="w:1/2">
                <InputText
                  type="email"
                  title={"EMAIL"}
                  placeholder={"Example@email.com"}
                />
              </div>
            </div>
            <InputText
              title={"MESSAGE"}
              placeholder={
                "How can I help with your next architecture challenge?"
              }
              textarea
            />
            <div className="flex justify-end">
              <Button
                className="py-2 px-6 text-[12px]"
                rightIcon={<SendHorizontal className="ml-2" size={14} />}
              >
                SEND MESSAGE
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:w-1/2 flex flex-col gap-6">
          <Card title={"Connect_"} background="bg-gray-200">
            <div className="space-y-4">
              <Button
                variant="soft"
                className="rounded-lg py-3 px-2 font-semibold"
                icon={<Share2 className="text-primary" />}
                rightIcon={<ArrowRight />}
              >
                LinkedIn
              </Button>
              <Button
                variant="soft"
                className="rounded-lg py-3 px-2 font-semibold"
                icon={<SquareTerminal className="text-primary" />}
                rightIcon={<ArrowRight />}
              >
                GitHub
              </Button>
              <Button
                variant="soft"
                className="rounded-lg py-3 px-2 font-semibold"
                icon={<AtSign className="text-primary" />}
                rightIcon={<ArrowRight />}
              >
                Email Me
              </Button>
            </div>
          </Card>
          <Card background="bg-gray-200">
            <div>
              <div className="flex gap-2">
                <div className="text-primary">$</div>
                <div>
                  <p>ping -c 3 developer_architect</p>
                  <div className="text-black/50">
                    <p>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045</p>
                    <p>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045</p>
                    <p>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-primary">
                  - - - developer_architect ping statistics - - -
                </div>
                <p className="pl-4 text-black/50">
                  3 packets trasmitted, 3 received, 0% packet loss
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
