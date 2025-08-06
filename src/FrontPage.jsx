import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaArtstation } from "react-icons/fa";


const FrontPage = () => {

  const [isOpen, setIsOpen] = useState(false);

  const points = [
    [0, 70], [50, 60], [100, 80], [150, 50], [200, 75], [250, 60], [300, 85],
  ];

  const pathD = `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')}`;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
  <header className="bg-slate-800 border-b border-slate-700">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-teal-400 gap-2 flex items-center"><FaArtstation className='text-slate-300' /> SalaryGen</h1>

    
    <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
      <Link to="/features" className="italic tracking-wide text-sm font-semibold  hover:text-teal-400">Features</Link>
      <Link to="/aboutUs"  className="italic tracking-wide text-sm font-semibold hover:text-teal-400">About Us</Link>
      <Link to="/login"    className="italic tracking-wide text-sm font-semibold bg-teal-500 text-slate-900 px-4 py-2 rounded hover:bg-white transition">Login</Link>
      <Link to="/register" className="italic tracking-wide text-sm font-semibold bg-slate-200 text-slate-900 px-4 py-2 rounded hover:bg-teal-400 transition">Register</Link>
    </nav>

    
    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 focus:outline-none">
      {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
    </button>
  </div>

  
  {isOpen && (
    <div className="md:hidden bg-slate-800 px-6 pb-4 space-y-2 text-sm text-gray-300">
      <Link to="/features" className="block hover:text-teal-400">Features</Link>
      <Link to="/aboutUs" className="block hover:text-teal-400">About Us</Link>
      <Link to="/login" className="block bg-teal-500 text-slate-900 px-4 py-2 rounded hover:bg-white transition">Login</Link>
      <Link to="/register" className="block bg-slate-200 text-slate-900 px-4 py-2 rounded hover:bg-teal-400 transition">Register</Link>
    </div>
  )}
</header>


      <main className="flex flex-1 flex-col lg:flex-row items-center justify-between px-10 py-20 gap-10">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="text-4xl font-bold text-white leading-snug">
            Effortless Salary Acquittance <br />
            <span className="text-teal-400">for Modern HR Teams</span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            Automate payroll, visualize deductions, and generate clean reports in seconds.
          </p>
          <div className="mt-6 space-x-4">
            <Link to={"/register"} className="bg-teal-500 text-slate-900 px-6 py-3 rounded hover:bg-teal-400 transition">Get Started</Link>
            <Link to={"/features"} className="bg-transparent text-teal-400 border border-teal-500 px-6 py-3 rounded hover:bg-slate-800 transition">Watch Demo</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md bg-slate-800 rounded-xl shadow-md border border-slate-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Net Salary Trend</h3>

          <svg viewBox="0 0 320 100" className="w-full h-32 text-teal-400">
            <motion.path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            Live trend updates enabled
          </div>
        </motion.div>
      </main>

      <footer className="text-center text-sm text-gray-600 py-4 border-t border-slate-800">
        © 2025 SalaryGen. All rights reserved.
      </footer>
    </div>
  );
};

export default FrontPage;
