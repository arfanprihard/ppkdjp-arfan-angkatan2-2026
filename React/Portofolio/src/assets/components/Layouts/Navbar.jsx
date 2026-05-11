import Button from "../Elements/Button"
import { Download } from "lucide-react";
const Navbar = () => {
    return (
        <nav className="">
            <div>
                <h1>
                    ArfanDev
                </h1>
            </div>
            <div>
                <a href="">Home</a>
                <a href="">Experience</a>
                <a href="">Projects</a>
                <a href="">Skills</a>
                <a href="">Contact</a>
            </div>
            <div>
                <Button className="py-2 px-2" icon={<Download size={18} />}>
                    Download CV
                </Button>
            </div>
        </nav>
    )
}

export default Navbar
