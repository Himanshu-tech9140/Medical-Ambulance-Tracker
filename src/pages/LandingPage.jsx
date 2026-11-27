import {
  ArrowDown,
  ArrowRight,
  Check,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedButton from "../components/landing/AnimatedButton.jsx";
import AmbulanceHeroVisual from "../components/landing/AmbulanceHeroVisual.jsx";
import LandingFooter from "../components/landing/LandingFooter.jsx";
import LandingNavbar from "../components/landing/LandingNavbar.jsx";
import {
  AboutSection,
  CallToActionSection,
  ContactSection,
  EmergencyStrip,
  FeaturesSection,
  HowItWorksSection,
  ServicesSection,
  StatsSection,
  TrackingPreviewSection,
} from "../components/landing/LandingSections.jsx";

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-x-hidden bg-white">
      <LandingNavbar />
      <main>
        <section
          className="relative isolate overflow-hidden bg-[linear-gradient(130deg,#f3f9ff_0%,#ffffff_55%,#f7fbff_100%)]"
          id="home"
        >
          <div className="pointer-events-none absolute -right-32 -top-36 -z-10 h-[520px] w-[520px] rounded-full bg-brand-100/60 blur-[90px]" />
          <div className="pointer-events-none absolute -left-44 bottom-0 -z-10 h-[350px] w-[350px] rounded-full bg-cyan-100/45 blur-[90px]" />
          <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[720px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:py-14">
            <motion.div
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="relative z-10 max-w-[600px]"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-3.5 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-800 sm:text-xs">
                  Smart emergency response system
                </span>
              </div>
              <h1 className="font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[60px]">
                Emergency?
                <br />
                <span className="relative inline-block text-brand-600">
                  Help Is Just One
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 w-full"
                    fill="none"
                    viewBox="0 0 340 10"
                  >
                    <path d="M3 7c74-5 194-6 334-2" stroke="#70C6F5" strokeLinecap="round" strokeWidth="5" />
                  </svg>
                </span>
                <br />
                Click Away.
              </h1>
              <p className="mt-6 max-w-[510px] text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Experience smarter emergency response with quick ambulance
                requests, journey updates and reliable medical assistance.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AnimatedButton
                  as={Link}
                  className="min-h-[52px] w-full justify-center rounded-[14px] px-5 text-sm shadow-lg shadow-brand-600/20 sm:w-auto sm:justify-start"
                  to="/login"
                  wrapperClassName="w-full sm:w-auto"
                >
                  Request Emergency Help <ArrowRight size={17} />
                </AnimatedButton>
                <motion.a
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 text-sm font-bold text-ink shadow-sm transition hover:border-brand-200 hover:bg-brand-50/60 sm:justify-start"
                  href="#services"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Explore Services <ArrowDown size={16} />
                </motion.a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="text-emerald-500" size={16} />
                  Quick emergency requests
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="text-brand-600" size={16} />
                  Ambulance journey updates
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="text-emerald-500" size={16} />
                  Medical assistance
                </span>
              </div>
            </motion.div>
            <div className="relative mx-auto w-full max-w-[670px] lg:translate-x-4">
              <AmbulanceHeroVisual />
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-8">
            <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[11px] text-slate-400 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Frontend demo only—not an emergency service. For immediate danger, contact local emergency services.
            </div>
          </div>
        </section>

        <EmergencyStrip />
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <TrackingPreviewSection />
        <FeaturesSection />
        <StatsSection />
        <CallToActionSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
