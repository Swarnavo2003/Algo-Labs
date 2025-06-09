import { Github, Linkedin, Twitter, User2 } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full border-t-2 flex my-5">
      <div className="flex items-center justify-between w-full mx-auto max-w-6xl mt-5">
        <div className="flex items-center justify-center gap-2">
          <User2 size={20} />
          <p>Developed by developers for developers</p>
        </div>

        <ul className="flex items-center gap-4">
          <li className="flex gap-1 items-center justify-center cursor-pointer hover:text-orange-500">
            <Github size={20} />
            <span>Github</span>
          </li>
          <li className="flex gap-1 items-center justify-center cursor-pointer hover:text-orange-500">
            <Twitter size={20} /> <span>Twitter</span>
          </li>
          <li className="flex gap-1 items-center justify-center cursor-pointer hover:text-orange-500">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
