import { Link } from "react-router-dom";

const links = [
  {
    title: "About",
    href: "/",
  },
  {
    title: "Github",
    href: "/",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

export default function FooterSection() {
  return (
    <footer className="border-t bg-white py-8 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Tailark, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
