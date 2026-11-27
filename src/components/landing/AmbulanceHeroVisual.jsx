import { Activity, MapPin, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const primaryPhoto = "/images/ambulance-day.jpg";
const fallbackPhoto = "/images/ambulance-night.jpg";

export default function AmbulanceHeroVisual() {
  const reduceMotion = useReducedMotion();
  const [photo, setPhoto] = useState(primaryPhoto);
  const [photoFailed, setPhotoFailed] = useState(false);

  function useFallbackPhoto() {
    if (photo !== fallbackPhoto) {
      setPhoto(fallbackPhoto);
      return;
    }

    setPhotoFailed(true);
  }

  return (
    <div className="relative mx-auto w-full max-w-[670px]">
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-brand-100/70 via-cyan-100/45 to-red-100/30 blur-2xl" />
      <motion.div
        animate={reduceMotion ? undefined : { x: 0, opacity: 1, scale: 1 }}
        className="relative z-10 overflow-hidden rounded-[30px] border border-white/80 bg-[#102e48] shadow-[0_32px_80px_rgba(13,52,86,0.24)]"
        initial={reduceMotion ? false : { x: "48%", opacity: 0, scale: 0.97 }}
        transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="relative aspect-[1.14/1] overflow-hidden sm:aspect-[1.32/1]">
          {!photoFailed ? (
            <img
              alt="A real white emergency ambulance with red medical markings travelling on a road"
              className="absolute inset-0 h-full w-full object-cover object-[center_66%]"
              height="1200"
              onError={useFallbackPhoto}
              src={photo}
              width="1800"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#173b5b] px-8 text-center text-sm font-semibold text-white/80">
              Ambulance photo is unavailable. The tracking demo remains accessible below.
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071e33]/75 via-[#071e33]/10 to-[#071e33]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081d31]/20 via-transparent to-[#081d31]/10" />

          {!photoFailed && (
            <>
              <motion.span
                animate={reduceMotion ? undefined : { opacity: [0.35, 0.95, 0.35] }}
                className="absolute left-[48%] top-[48%] h-6 w-12 rounded-full bg-red-500/60 blur-lg"
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                animate={reduceMotion ? undefined : { opacity: [0.9, 0.28, 0.9] }}
                className="absolute left-[55%] top-[47%] h-6 w-12 rounded-full bg-blue-400/70 blur-lg"
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071e33]/75 to-transparent" />
          <div aria-hidden="true" className="hero-road-motion absolute inset-x-0 bottom-0 h-12 opacity-40" />

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#08243d]/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-white backdrop-blur-md sm:left-6 sm:top-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            Demo response visual
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white sm:bottom-7 sm:left-7 sm:right-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                Help, with more clarity
              </p>
              <p className="font-display mt-1 text-lg font-extrabold sm:text-2xl">
                A response journey you can follow.
              </p>
            </div>
            <div aria-hidden="true" className="hidden items-center gap-1.5 sm:flex">
              <span className="hero-light hero-light-red" />
              <span className="hero-light hero-light-blue" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        className="absolute -left-2 top-[18%] z-20 flex items-center gap-3 rounded-2xl border border-white bg-white/95 p-3.5 shadow-popover backdrop-blur sm:-left-5 sm:p-4"
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ShieldCheck size={20} />
        </span>
        <span>
          <span className="block text-xs font-extrabold text-ink">Request flow</span>
          <span className="mt-0.5 block text-[10px] text-muted">Coordinated demo</span>
        </span>
      </motion.div>

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
        className="absolute -bottom-5 right-0 z-20 rounded-2xl border border-white bg-white/95 p-3.5 shadow-popover backdrop-blur sm:-right-4 sm:p-4"
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <MapPin size={17} />
          </span>
          <span>
            <span className="block text-[10px] text-muted">Tracking preview</span>
            <span className="mt-0.5 flex items-center gap-1 text-xs font-extrabold text-ink">
              <Activity size={13} className="text-emerald-500" />
              Sample location
            </span>
          </span>
        </div>
      </motion.div>

      <a
        className="relative z-10 mt-3 block text-right text-[10px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-brand-700"
        href="https://www.pexels.com/photo/a-white-ambulance-on-the-road-7527770/"
        rel="noreferrer"
        target="_blank"
      >
        Photo by Ajil Saji · Pexels License
      </a>
    </div>
  );
}
