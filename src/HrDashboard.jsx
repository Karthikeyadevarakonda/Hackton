import React from 'react'
import { useNavigate } from 'react-router-dom';

const HrDashboard = () => {
  const navigate = useNavigate();
  const logout = ()=>{
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login")
  }
  return (
    <div  className='flex gap-5 p-10'>
      <h1>THIS IS HR DASHBOARD</h1>
      <button onClick={logout} className="bg-blue-500  text-slate-900 px-4 py-2 rounded hover:bg-blue-500 transition">LOG-OUT</button>
    </div>
  )
}

export default HrDashboard
