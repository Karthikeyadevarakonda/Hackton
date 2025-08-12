
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  CodeBracketIcon,
  FireIcon,
  ServerStackIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const team = [
  { name: "Suchesh", role: "Team Lead", icon: UserCircleIcon, bio: "Leads direction, planning & QA." },
  { name: "Manikanta", role: "Frontend Developer", icon: CodeBracketIcon, bio: "Builds delightful UI & components." },
  { name: "Waseem", role: "Backend Developer", icon: ServerStackIcon, bio: "APIs, DBs and server reliability." },
  { name: "Hitesh", role: "Git & Repo Management", icon: ClipboardDocumentCheckIcon, bio: "Repo hygiene and CI/CD." },
  { name: "Karthikeya", role: "Full Stack Developer", icon: FireIcon, bio: "Full-stack workhorse (center of the team)." },
];

const gradients = [
  "bg-gradient-to-r from-blue-400 to-cyan-400",
  "bg-gradient-to-r from-pink-500 to-rose-400",
  "bg-gradient-to-r from-teal-400 to-emerald-400",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-yellow-400", 
];


const TeamCard = ({ member, idx }) => {
  const Icon = member.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="relative rounded-2xl p-6 w-[250px] h-[240px] flex flex-col items-center justify-center"
      style={{ background: "#2c313a", boxShadow: "0 8px 24px rgba(2,6,23,0.6)" }}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${gradients[idx % gradients.length]} text-white shadow-md`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 text-center">{member.name}</h3>
      <p className="text-gray-300 text-sm text-center">{member.role}</p>
      <p className="text-gray-400 text-xs text-center mt-3 px-2">{member.bio}</p>
    </motion.div>
  );
};


const CarouselItem = ({ member, idx, onOpen }) => {
  const Icon = member.icon;
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="snap-center flex-shrink-0 w-64 sm:w-72 p-4 rounded-xl"
    >
      <div className="bg-[#1f2328] rounded-xl p-4 h-full flex flex-col items-center justify-between shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${gradients[idx % gradients.length]} text-white text-xl shadow-inner`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white leading-tight">{member.name}</h4>
            <p className="text-gray-300 text-sm mt-1">{member.role}</p>
          </div>
        </div>

        <button
          onClick={() => onOpen(member, idx)}
          className="mt-4 w-full bg-teal-500 text-slate-900 font-semibold py-2 rounded hover:bg-teal-400 transition"
          aria-label={`Open ${member.name} details`}
        >
          View
        </button>
      </div>
    </motion.div>
  );
};


const About = () => {
  const [modal, setModal] = useState({ open: false, member: null, idx: 0 });
  const carouselRef = useRef(null);

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && modal.open) setModal({ open: false, member: null, idx: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open]);

  // center selected item in the carousel (optional)
  const openModal = (member, idx) => {
    setModal({ open: true, member, idx });
    // center the clicked item in horizontal scroll (nice UX)
    if (carouselRef.current) {
      const container = carouselRef.current;
      const item = container.children[idx];
      if (item) {
        const offset = item.offsetLeft - (container.clientWidth - item.clientWidth) / 2;
        container.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-12">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 text-3xl sm:text-4xl font-bold">
          <UserGroupIcon className="w-7 h-7 text-slate-100" />
          Meet The Team
        </div>
        <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
         We dream big, build fast, and keep it personal. Meet the people turning bold ideas into reality
        </p>
      </header>

      {/* Desktop grid */}
    
<section className="hidden md:flex md:items-center md:justify-center min-h-[80vh]">
  <div className="grid grid-cols-3 gap-4 max-w-5xl">
    {team.slice(0, 3).map((m, i) => (
      <TeamCard key={m.name} member={m} idx={i} />
    ))}

    {team.length > 3 && (
      <div className="col-span-3 flex justify-center gap-4">
        {team.slice(3).map((m, i) => (
          <TeamCard key={m.name} member={m} idx={i + 3} />
        ))}
      </div>
    )}
  </div>
</section>



      {/* Mobile carousel */}
      <section className="md:hidden mt-4">
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto px-4 pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
            aria-label="Team carousel"
          >
            {team.map((m, i) => (
              <CarouselItem key={m.name} member={m} idx={i} onOpen={openModal} />
            ))}
          </div>

          {/* small scrollbar hint */}
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center pointer-events-none">
            <div className="w-24 h-1 rounded-full bg-slate-700/60" />
          </div>
        </div>
      </section>

      {/* Modal for details */}
      <AnimatePresence>
        {modal.open && modal.member && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setModal({ open: false, member: null, idx: 0 })}
              aria-hidden="true"
            />
            <motion.div
              className="relative bg-[#111216] rounded-xl p-6 w-[92vw] max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-300 hover:text-white"
                onClick={() => setModal({ open: false, member: null, idx: 0 })}
                aria-label="Close details"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${gradients[modal.idx % gradients.length]} text-white text-xl shadow-md`}>
                  <modal.member.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{modal.member.name}</h3>
                  <p className="text-sm text-gray-300">{modal.member.role}</p>
                </div>
              </div>

              <p className="text-gray-400 mt-4 text-sm">{modal.member.bio}</p>

              <div className="mt-6 flex gap-3">
                <a
                  className="inline-block px-4 py-2 bg-teal-500 text-slate-900 rounded font-semibold hover:bg-teal-400"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Message
                </a>
                <button
                  onClick={() => setModal({ open: false, member: null, idx: 0 })}
                  className="px-4 py-2 border border-slate-700 rounded text-sm text-gray-300 hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
