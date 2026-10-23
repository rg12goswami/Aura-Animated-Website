
import { ArrowUpRight, Menu } from "lucide-react";

const links = [
  { label: "Find a doctor", href: "#doctors" },
  { label: "Our approach", href: "#story" },
];

export default function Navbar() {
  return (
    <header className="relative z-50 px-5 pt-5 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-black/5 bg-white/50 px-5 py-3 backdrop-blur-xl sm:px-7">
        <a
          href="#home"
          aria-label="Carefully home"
          className="flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C82F3D] text-lg font-bold text-white">
            c.
          </span>

          <span className="text-xl font-bold tracking-tight">
            carefully<span className="text-[#C82F3D]">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#625B53] transition-colors hover:text-[#C82F3D]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#doctors"
          className="group flex items-center gap-2 rounded-full bg-[#24211F] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C82F3D]"
        >
          Get started
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </nav>
    </header>
  );
}
