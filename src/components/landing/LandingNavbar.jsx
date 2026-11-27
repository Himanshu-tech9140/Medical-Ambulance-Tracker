import { Activity, Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton.jsx";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function updateNavigation() {
      setScrolled(window.scrollY > 12);
      let active = "#home";

      for (const link of links) {
        const section = document.querySelector(link.href);
        if (section && section.getBoundingClientRect().top <= 150) {
          active = link.href;
        }
      }

      setActiveSection(active);
    }

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    return () => window.removeEventListener("scroll", updateNavigation);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <motion.header
      animate={{ backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.76)" }}
      className={`sticky top-0 z-40 border-b border-slate-100/80 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_8px_24px_rgba(27,78,132,0.07)]" : ""}`}
      initial={false}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a
          aria-label="JeevanSetu home"
          className="flex items-center gap-2.5"
          href="#home"
          onClick={closeMenu}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            <Activity size={21} strokeWidth={2.6} />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-[19px] font-extrabold tracking-tight text-ink">
              Jeevan<span className="text-brand-600">Setu</span>
            </span>
            <span className="text-[10px] font-bold leading-tight text-slate-500">
              ABESEC Ghaziabad
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <a
              aria-current={activeSection === link.href ? "location" : undefined}
              className={`relative py-2 text-[12px] font-bold transition ${
                activeSection === link.href
                  ? "text-brand-700"
                  : "text-slate-600 hover:text-brand-700"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.span
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                  layoutId="active-landing-link"
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                />
              )}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            className="rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-slate-50"
            to="/login"
          >
            Login
          </Link>
          <AnimatedButton
            as={Link}
            className="min-h-10 rounded-xl px-4 text-xs"
            to="/login"
            wrapperClassName="inline-flex"
          >
            Get Emergency Help
          </AnimatedButton>
        </div>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 xl:hidden"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-3 shadow-lg xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <a
                aria-current={activeSection === link.href ? "location" : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  activeSection === link.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                }`}
                href={link.href}
                key={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex gap-3 border-t border-slate-100 pt-4">
              <Link
                className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-ink"
                onClick={closeMenu}
                to="/login"
              >
                Login
              </Link>
              <AnimatedButton
                as={Link}
                className="min-h-11 flex-1"
                onClick={closeMenu}
                to="/login"
                wrapperClassName="flex-1"
              >
                Get emergency help
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
