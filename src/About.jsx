import React from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  CodeBracketIcon,
  FireIcon,
  ServerStackIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const team = [
  { name: "Suchesh", role: "Team Lead", icon: UserCircleIcon },
  { name: "Manikanta", role: "Frontend Developer", icon: CodeBracketIcon },
  { name: "Waseem", role: "Backend Developer", icon: ServerStackIcon },
  { name: "Hitesh", role: "Git & Repo Management", icon: ClipboardDocumentCheckIcon },
  { name: "Karthikeya", role: "Full Stack Developer", icon: FireIcon },
];

const colors = [
  "bg-gradient-to-r from-orange-400 to-yellow-300",
  "bg-gradient-to-r from-pink-500 to-rose-400",
  "bg-gradient-to-r from-teal-400 to-emerald-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-t from-black via-slate-700 to-[#000000]",
];

const TeamCard = ({ name, role, index, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      viewport={{ once: true }}
      className="relative rounded-2xl p-6 w-[270px] h-[260px] flex flex-col items-center justify-center"
      style={{
      background: "#3a3f51",
        boxShadow:
          "0.5em 0.5em 1em rgba(0,0,0,0.5), -0.3em -0.3em 0.8em rgba(255,255,255,0.05)",
        borderRadius: "1rem",
      }}
    >
      
      <div className="absolute -inset-1 rounded-2xl bg-slate-700 opacity-10 blur-2xl pointer-events-none z-0"></div>

      <div className="z-10 flex flex-col items-center">
       
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner mb-4 ${colors[index]}`}
        >
          {name.charAt(0)}
        </div>

        
        <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>

      
        <p className="text-gray-400 text-sm text-center flex items-center gap-2 mt-1">
          <Icon className="w-5 h-5 text-orange-300" />
          {role}
        </p>
      </div>
    </motion.div>
  );
};



const About = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-6 flex flex-col items-center">
      <motion.h1
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="text-4xl font-bold mb-10 bg-gradient-to-r from-green-400 via-teal-500 to-emerald-400 text-transparent bg-clip-text drop-shadow flex items-center gap-3"
>
  <UserGroupIcon className="w-8 h-8 text-slate-100" />
  Meet The Team
</motion.h1>


      <div className="flex flex-wrap justify-center gap-10 max-w-6xl">
        {team.map((member, index) => (
          <TeamCard key={index} index={index} {...member} />
        ))}
      </div>
    </div>
  );
};

export default About;
