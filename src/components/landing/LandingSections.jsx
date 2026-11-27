import {
  Activity,
  Ambulance,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  ClipboardList,
  ChevronRight,
  Clock3,
  HeartPulse,
  LocateFixed,
  MapPin,
  MapPinned,
  Navigation,
  PhoneCall,
  Radio,
  Route,
  ShieldCheck,
  Siren,
  Stethoscope,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton.jsx";
import Card from "../ui/Card.jsx";

const services = [
  {
    icon: Ambulance,
    title: "Ambulance booking",
    description:
      "Share the emergency details and pickup location in a clear, guided request.",
    iconStyle: "bg-brand-50 text-brand-700",
    link: "Request assistance",
    href: "/login",
  },
  {
    icon: MapPinned,
    title: "Ambulance tracking",
    description:
      "See the assigned vehicle, response status and estimated arrival in one place.",
    iconStyle: "bg-cyan-50 text-cyan-700",
    link: "Explore tracking",
    href: "#tracking-preview",
  },
  {
    icon: Siren,
    title: "Emergency assistance",
    description:
      "Keep key incident information together so dispatch teams can coordinate a response.",
    iconStyle: "bg-red-50 text-emergency",
    link: "Get emergency help",
    href: "/login",
  },
  {
    icon: Building2,
    title: "Hospital information",
    description:
      "Review care destination details as part of the emergency coordination journey.",
    iconStyle: "bg-violet-50 text-violet-600",
    link: "Explore the platform",
    href: "#contact",
  },
];

const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "Report emergency",
    description: "Share your location and the type of assistance needed.",
  },
  {
    number: "02",
    icon: Radio,
    title: "Request confirmation",
    description: "An administrator reviews the request and its details.",
  },
  {
    number: "03",
    icon: Ambulance,
    title: "Ambulance assigned",
    description: "An available ambulance is selected for the response.",
  },
  {
    number: "04",
    icon: Navigation,
    title: "Track your ambulance",
    description: "Follow the sample journey and status updates in your account.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Simple emergency requests",
    description: "A guided flow keeps the important details easy to provide.",
  },
  {
    icon: Radio,
    title: "Centralized coordination",
    description: "Requests, fleet availability and dispatch updates share one workspace.",
  },
  {
    icon: Users,
    title: "Student-friendly experience",
    description: "Clear actions and status language help people know what happens next.",
  },
  {
    icon: ClipboardList,
    title: "Organized records",
    description: "Request history is easy for students and administrators to review.",
  },
  {
    icon: MapPinned,
    title: "Transparent status",
    description: "A step-by-step timeline makes the response process easier to follow.",
  },
  {
    icon: ShieldCheck,
    title: "Responsive access",
    description: "The interface adapts across desktop, tablet and mobile screens.",
  },
];

function Reveal({ children, className = "", delay = 0, hover = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay / 1000, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.16 }}
      whileHover={hover && !reduceMotion ? { y: -5 } : undefined}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function EmergencyStrip() {
  const items = [
    { icon: HeartPulse, label: "Emergency assistance" },
    { icon: Radio, label: "Smart dispatch" },
    { icon: MapPin, label: "Journey updates" },
    { icon: Stethoscope, label: "Medical support" },
  ];

  return (
    <section aria-label="JeevanSetu capabilities" className="bg-white py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 sm:px-8 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            className="group flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-4 transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-card sm:justify-start sm:px-5"
            key={label}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon size={19} />
            </span>
            <span className="text-xs font-bold text-ink sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  const points = [
    {
      icon: Clock3,
      title: "Faster response",
      description: "Make the request path short and clear when time matters.",
    },
    {
      icon: Radio,
      title: "Smarter coordination",
      description: "Bring student requests and dispatch teams into one workflow.",
    },
    {
      icon: MapPinned,
      title: "Transparent tracking",
      description: "Keep progress and next steps visible throughout the response.",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24" id="about">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal className="relative">
          <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-brand-50 via-cyan-50 to-white" />
          <div className="relative overflow-hidden rounded-[30px] border border-brand-100 bg-[#f3f9ff] p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted">Connected care journey</p>
                <p className="mt-1 font-display text-lg font-extrabold text-ink">
                  Response, coordinated.
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                <Stethoscope size={21} />
              </span>
            </div>
            <TrackingMapArtwork />
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["Request", "Received"],
                ["Dispatch", "Coordinated"],
                ["Journey", "Updated"],
              ].map(([label, status]) => (
                <div className="rounded-xl bg-white p-3" key={label}>
                  <p className="text-[10px] font-semibold text-muted">{label}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-ink sm:text-[11px]">
                    <Check size={12} className="shrink-0 text-emerald-500" />
                    {status}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-popover sm:-right-5 sm:p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BadgeCheck size={21} />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-ink">Care comes first</span>
              <span className="mt-0.5 block text-[11px] text-muted">Built for urgent moments</span>
            </span>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <Eyebrow>About JeevanSetu</Eyebrow>
          <h2 className="font-display mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Making emergency response{" "}
            <span className="text-brand-600">smarter and clearer.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            JeevanSetu simplifies emergency medical transportation through an
            integrated digital platform. It connects students, emergency
            administrators and ambulance services with a streamlined request
            and tracking experience.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            From reporting an emergency to following the assigned response,
            each step is designed to reduce uncertainty and keep essential
            information in one place.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {points.map(({ icon: Icon, title, description }) => (
              <div className="flex gap-3" key={title}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink">{title}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="bg-[#f7faff] py-20 sm:py-24" id="services">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>What we offer</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Our emergency services
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            Purpose-built tools help students request assistance and stay
            informed throughout a coordinated response.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, ...service }, index) => (
            <Reveal delay={index * 70} hover key={service.title}>
              <Card className="group flex h-full flex-col border-slate-100 p-6 transition duration-300 hover:border-brand-100 hover:shadow-[0_18px_40px_rgba(30,64,112,0.1)]">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.iconStyle}`}>
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <h3 className="font-display mt-5 text-base font-extrabold text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {service.description}
                </p>
                {service.href.startsWith("#") ? (
                  <a
                    className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-brand-700 transition group-hover:gap-2"
                    href={service.href}
                  >
                    {service.link} <ChevronRight size={15} />
                  </a>
                ) : (
                  <Link
                    className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-brand-700 transition group-hover:gap-2"
                    to={service.href}
                  >
                    {service.link} <ChevronRight size={15} />
                  </Link>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-white py-20 sm:py-24" id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Simple by design</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            How JeevanSetu works
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            Four clear steps connect an emergency request with a coordinated response.
          </p>
        </Reveal>
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-brand-100 lg:block" />
          {steps.map(({ icon: Icon, ...step }, index) => (
            <Reveal className="relative text-center" delay={index * 70} key={step.number}>
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-brand-100 bg-white text-brand-700 shadow-card">
                <Icon size={24} strokeWidth={1.8} />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-[10px] font-extrabold text-white">
                  {step.number.slice(1)}
                </span>
              </div>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
                Step {step.number}
              </p>
              <h3 className="font-display mt-2 text-base font-extrabold text-ink">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[250px] text-sm leading-6 text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <AnimatedButton as={Link} to="/login">
            Start a request <ChevronRight size={16} />
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}

export function TrackingPreviewSection() {
  return (
    <section className="bg-[#f7faff] py-20 sm:py-24" id="tracking-preview">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Tracking preview</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            See the response journey at a glance.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            A sample view of pickup, assigned ambulance and destination details.
          </p>
        </Reveal>
        <Reveal className="mt-12 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(24,62,103,0.1)]">
          <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
            <div className="relative min-h-[310px] overflow-hidden bg-[#eaf3f8] sm:min-h-[390px]">
              <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(28deg,transparent_47%,#fff_47%,#fff_52%,transparent_52%),linear-gradient(118deg,transparent_42%,#fff_42%,#fff_46%,transparent_46%),linear-gradient(0deg,transparent_48%,#dce8ee_48%,#dce8ee_52%,transparent_52%)] [background-size:240px_200px,280px_220px,100%_125px]" />
              <div className="absolute left-[8%] top-[15%] h-28 w-36 rounded-[45%] bg-emerald-100/70 blur-xl" />
              <div className="absolute bottom-[5%] right-[9%] h-36 w-44 rounded-full bg-blue-100/80 blur-xl" />
              <svg
                aria-label="Illustrative route connecting campus pickup, ambulance and hospital"
                className="absolute inset-0 h-full w-full"
                fill="none"
                role="img"
                viewBox="0 0 760 420"
              >
                <path d="M92 314C188 302 151 206 272 207c92 1 101 107 203 71 63-22 40-104 131-101 33 1 57-18 83-47" stroke="#fff" strokeLinecap="round" strokeWidth="18" />
                <path d="M92 314C188 302 151 206 272 207c92 1 101 107 203 71 63-22 40-104 131-101 33 1 57-18 83-47" stroke="#168ce0" strokeDasharray="9 10" strokeLinecap="round" strokeWidth="5" />
              </svg>
              <MapMarker className="left-[7%] top-[68%]" color="bg-emerald-500" icon={MapPin} label="Pickup" />
              <MapMarker className="left-[57%] top-[58%]" color="bg-brand-600" icon={Ambulance} label="Ambulance" />
              <MapMarker className="right-[8%] top-[24%]" color="bg-emergency" icon={Building2} label="Hospital" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[11px] font-bold text-ink shadow-card backdrop-blur">
                <LocateFixed size={14} className="text-brand-600" />
                Illustrative route
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/85 px-2.5 py-1.5 text-[10px] text-slate-500">
                Fixed sample locations · not live GPS
              </div>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Sample status: On the way
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Route size={19} />
                </span>
              </div>
              <h3 className="font-display mt-6 text-xl font-extrabold text-ink">
                Ambulance en route
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Example tracking details for a demo request. This preview does
                not use live GPS data.
              </p>
              <div className="mt-6 space-y-4">
                <TrackingDetail icon={MapPin} label="Pickup location" value="North Campus · Main Gate" />
                <TrackingDetail icon={Ambulance} label="Assigned vehicle" value="MT-AMB-05 · Demo unit" />
                <TrackingDetail icon={Clock3} label="Estimated arrival" value="8 min · Sample ETA" />
                <TrackingDetail icon={Building2} label="Destination" value="Central Medical Centre" />
              </div>
              <AnimatedButton as={Link} className="mt-auto w-full justify-center" to="/login" wrapperClassName="mt-auto w-full">
                Explore the platform <ArrowRight size={16} />
              </AnimatedButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MapMarker({ className, color, icon: Icon, label }) {
  return (
    <div className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${className}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg ${color}`}>
        <Icon size={17} />
      </span>
      <span className="mt-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-ink shadow-sm">
        {label}
      </span>
    </div>
  );
}

function TrackingDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-700">
        <Icon size={16} />
      </span>
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</span>
        <span className="mt-1 block text-xs font-bold leading-5 text-ink">{value}</span>
      </span>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="bg-white py-20 sm:py-24" id="features">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Why JeevanSetu</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Thoughtful tools for urgent moments.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            An approachable experience for students and a practical workspace
            for administrators.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative overflow-hidden rounded-[28px] bg-slate-100">
            <img
              alt="A real emergency ambulance travelling on a road"
              className="aspect-[4/3] h-full w-full object-cover"
              height="1200"
              loading="lazy"
              src="/images/ambulance-day.jpg"
              width="1800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2e4b]/75 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">Designed for coordination</p>
                <p className="mt-2 font-display text-xl font-extrabold sm:text-2xl">One clearer journey to care.</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <HeartPulse size={22} />
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.slice(0, 3).map((benefit, index) => (
                <BenefitCard benefit={benefit} key={benefit.title} index={index} />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1" delay={70}>
            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.slice(3).map((benefit, index) => (
                <BenefitCard benefit={benefit} key={benefit.title} index={index + 3} />
              ))}
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[28px] border border-brand-100 bg-[#f0f7fc] p-5 sm:p-8">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-100/80 blur-2xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted">JeevanSetu workspace</p>
                  <h3 className="font-display mt-1 text-xl font-extrabold text-ink">
                    Clear at every step.
                  </h3>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                  <Activity size={21} />
                </span>
              </div>
              <div className="relative mt-7 space-y-3">
                {[
                  ["Request received", "Your details are ready for review", "bg-brand-600"],
                  ["Ambulance assigned", "Dispatch coordination in progress", "bg-emerald-500"],
                  ["Journey update", "Sample status visible to the student", "bg-amber-500"],
                ].map(([title, detail, color], index) => (
                  <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-3.5" key={title}>
                    <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${color}`}>
                      {index === 0 ? <Check size={17} /> : index === 1 ? <Ambulance size={17} /> : <MapPin size={17} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-extrabold text-ink">{title}</span>
                      <span className="mt-1 block text-[10px] leading-4 text-muted">{detail}</span>
                    </span>
                    <ChevronRight className="shrink-0 text-slate-300" size={16} />
                  </div>
                ))}
              </div>
              <p className="relative mt-4 text-[10px] text-muted">
                Illustrative interface · sample status only
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index }) {
  const { icon: Icon, title, description } = benefit;
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:border-brand-100 ${index % 2 ? "sm:mt-6" : ""}`}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon size={20} />
      </span>
      <h3 className="font-display mt-4 text-sm font-extrabold text-ink">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
    </motion.div>
  );
}

export function StatsSection() {
  const metrics = [
    { value: 24, suffix: "/7", label: "Emergency access concept", icon: Clock3 },
    { value: 4, suffix: " steps", label: "Guided request journey", icon: Route },
    { value: 3, suffix: " roles", label: "Students, admins, responders", icon: Users },
    { value: 1, suffix: " workspace", label: "Shared coordination concept", icon: Activity },
  ];

  return (
    <section className="relative overflow-hidden bg-[#123f68] py-16 sm:py-20" id="impact">
      <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -left-8 -top-20 h-48 w-48 rounded-full border border-white/10" />
      <div className="absolute -bottom-44 -right-16 h-80 w-80 rounded-full border border-white/10" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            JeevanSetu at a glance
          </p>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Designed for a more responsive care journey.
          </h2>
          <p className="mt-3 text-xs leading-5 text-blue-100/70">
            Concept figures for this frontend demo—not live service statistics.
          </p>
        </Reveal>
        <div className="mt-11 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Reveal delay={index * 70} key={metric.label}>
              <DemoMetric metric={metric} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoMetric({ metric }) {
  const { value, suffix, label, icon: Icon } = metric;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setCount(value);
      return undefined;
    }

    setCount(0);
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (current) => setCount(Math.round(current)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-sm sm:p-6"
      ref={ref}
    >
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
        <Icon size={20} />
      </span>
      <p className="font-display mt-4 text-2xl font-extrabold text-white sm:text-3xl">
        {count}{suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-blue-100/75 sm:text-sm">{label}</p>
    </div>
  );
}

export function CallToActionSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#0c3152] py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_18%_40%,#237bb5_0,transparent_30%),radial-gradient(circle_at_88%_15%,#e5484d_0,transparent_22%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-red-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-200">
            <Siren size={13} /> A connected response concept
          </p>
          <h2 className="font-display mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Every second matters in an emergency.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
            Get connected to emergency assistance through the JeevanSetu
            frontend platform.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <AnimatedButton as={Link} className="min-h-12 w-full justify-center bg-emergency hover:bg-red-600" to="/login" wrapperClassName="w-full sm:w-auto">
            Request ambulance <ArrowRight size={16} />
          </AnimatedButton>
          <motion.a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            href="#features"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Explore platform <ArrowUpRight size={16} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section className="bg-[#f7faff] py-20 sm:py-24" id="contact">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="font-display mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Questions about JeevanSetu?{" "}
            <span className="text-brand-600">Let&apos;s talk.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
            Send a demo message or reach out through the placeholder contact
            channels. This form does not deliver messages to a server.
          </p>
          <div className="mt-7 space-y-3">
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:border-brand-200 hover:text-brand-700"
              href="mailto:hello@jeevansetu.example"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <PhoneCall size={14} />
              </span>
              hello@jeevansetu.example
            </a>
            <p className="text-xs text-muted">
              Placeholder contact details for the frontend demo.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50/80 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold text-red-800">
              <Siren size={15} /> In an emergency
            </p>
            <p className="mt-1 text-xs leading-5 text-red-800/80">
              If someone is in immediate danger, contact your local emergency services.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <form
            className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-card sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="contact-name" label="Name">
                <input autoComplete="name" className="contact-field" id="contact-name" maxLength="80" name="name" placeholder="Your name" required />
              </FormField>
              <FormField id="contact-email" label="Email">
                <input autoComplete="email" className="contact-field" id="contact-email" maxLength="254" name="email" placeholder="you@example.com" required type="email" />
              </FormField>
            </div>
            <FormField className="mt-4" id="contact-subject" label="Subject">
              <input className="contact-field" id="contact-subject" maxLength="120" name="subject" placeholder="How can we help?" required />
            </FormField>
            <FormField className="mt-4" id="contact-message" label="Message">
              <textarea className="contact-field min-h-32 resize-y" id="contact-message" maxLength="1200" minLength="10" name="message" placeholder="Write your message..." required />
            </FormField>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AnimatedButton className="min-h-12 justify-center" type="submit">
                Send demo message <ArrowRight size={16} />
              </AnimatedButton>
              <p className="text-[10px] leading-4 text-muted">
                Frontend only · message is not delivered
              </p>
            </div>
            {submitted && (
              <p aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800" role="status">
                Thanks! Your message passed demo validation. Nothing was sent or stored.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function FormField({ children, className = "", id, label }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-bold text-ink" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TrackingMapArtwork() {
  return (
    <div className="relative mt-6 h-[210px] overflow-hidden rounded-2xl border border-white bg-white/80 sm:h-[250px]">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,#e4eef8_1px,transparent_1px),linear-gradient(to_bottom,#e4eef8_1px,transparent_1px)] [background-size:27px_27px]" />
      <svg
        aria-label="Illustrative sample route between pickup and medical facility"
        className="absolute inset-0 h-full w-full"
        fill="none"
        role="img"
        viewBox="0 0 500 260"
      >
        <path d="M24 208c43-9 49-70 103-71 53-1 48 59 102 35 44-20 51-77 108-65 49 10 69-33 137-61" stroke="#b9ddf7" strokeDasharray="7 8" strokeLinecap="round" strokeWidth="5" />
        <path d="M24 208c43-9 49-70 103-71 53-1 48 59 102 35 44-20 51-77 108-65" stroke="#168CE0" strokeLinecap="round" strokeWidth="5" />
        <circle cx="24" cy="208" r="10" fill="#168CE0" stroke="white" strokeWidth="5" />
        <circle cx="337" cy="107" r="10" fill="#10B981" stroke="white" strokeWidth="5" />
        <circle cx="337" cy="107" r="23" stroke="#10B981" strokeOpacity=".2" strokeWidth="9" />
        <path d="M340 59c0-11 9-20 20-20h46c11 0 20 9 20 20v33c0 11-9 20-20 20h-46c-11 0-20-9-20-20V59Z" fill="white" stroke="#DFEAF4" />
        <path d="M364 69v19m-9.5-9.5h19" stroke="#168CE0" strokeLinecap="round" strokeWidth="4" />
        <path d="M400 70h15M400 80h10" stroke="#9BB0C3" strokeLinecap="round" strokeWidth="3" />
      </svg>
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-ink">Example response status</span>
      </div>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700">
      <span className="h-0.5 w-5 rounded-full bg-brand-500" />
      {children}
    </p>
  );
}
