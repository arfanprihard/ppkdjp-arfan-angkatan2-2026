import Button from "../../Elements/Button";
import PagesHeader from "../../Elements/PageHeader";
import { Download } from "lucide-react";

const Profile = () => {
  return (
    <div className="flex justify-center mb-10">
      <div className="section-container">
        <div className="flex md:flex-row flex-col gap-4 items-center">
          <div className="lg:w-1/2">
            <PagesHeader
              eyebrow={"Syestem Architecture & Engineering"}
              name={"Arfan Prihardiansyah"}
              role={"Web Dev"}
            />
            <p className="border-l-3 border-gray-400 px-4 max-w-7xl opacity-80 mb-7">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
              consequuntur porro earum illo minus perspiciatis, aut enim animi
              pariatur? Rerum, vero. Ipsa qui ipsum maxime ipsam ea ullam
              incidunt ex! Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Soluta repellendus in, nostrum harum qui dolorum quis labore
              a quos accusamus dolor ratione asperiores. Totam earum aut quaerat
              unde explicabo tempore!
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                rightIcon={<Download className="ml-2" size={20} />}
              >
                Download CV
              </Button>
              <Button variant="outline" className="px-6">
                View Project
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 border-9 border-gray-200 rounded-2xl">
            <img className="rounded-md" src="/jpg1.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
