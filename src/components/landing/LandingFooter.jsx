import {
  Activity,
  ArrowUpRight,
  Facebook,
  HeartPulse,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const exploreLinks = [
  { label: "About JeevanSetu", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks = [
  { label: "Request assistance", href: "/login" },
  { label: "Tracking preview", href: "#tracking-preview" },
  { label: "Student login", href: "/login" },
  { label: "Admin login", href: "/login" },
];

const socialLinks = [
  { label: "Facebook (demo link)", icon: Facebook },
  { label: "Instagram (demo link)", icon: Instagram },
  { label: "LinkedIn (demo link)", icon: Linkedin },
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#0d3456] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.9fr]">
          <div>
            <a
              aria-label="JeevanSetu home"
              className="inline-flex items-center gap-2.5"
              href="#home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-brand-500 text-white">
                <Activity size={21} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Jeevan<span className="text-blue-300">Setu</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/70">
              Smart medical and ambulance coordination designed to bring
              clarity, connection and care to urgent moments.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ label, icon: Icon }) => (
                <a
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-blue-100/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  href="#contact"
                  key={label}
                  title="Social profile placeholder — contact JeevanSetu"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup links={exploreLinks} title="Explore" />
          <FooterLinkGroup links={serviceLinks} title="Platform" />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              Get in touch
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm text-blue-100/75 transition hover:text-white"
              href="mailto:hello@jeevansetu.example"
            >
              hello@jeevansetu.example <ArrowUpRight size={14} />
            </a>
            <p className="mt-2 text-[10px] leading-4 text-blue-100/45">
              Placeholder contact for this frontend demo.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-blue-100/60">
              <HeartPulse size={14} className="text-cyan-300" />
              Here for a healthier tomorrow.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-blue-100/60 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p>
              Developed &amp; Maintained By: Himanshu Chaubey, Harsh Nagayach
            </p>
            <p>CSE, Section-11</p>
            <p>Full Stack Development Team</p>
            <p>© 2026 ABESEC Ghaziabad. All Rights Reserved.</p>
          </div>
          <p>Frontend demonstration only · not an emergency service.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ links, title }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {links.map(({ label, href }) =>
          href.startsWith("/") ? (
            <Link
              className="block w-fit text-sm text-blue-100/70 transition hover:text-white"
              key={label}
              to={href}
            >
              {label}
            </Link>
          ) : (
            <a
              className="block w-fit text-sm text-blue-100/70 transition hover:text-white"
              href={href}
              key={label}
            >
              {label}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
