import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8080/register',
        { username, password },
        { withCredentials: true }
      );
      console.log(res.data);
      setError(null);
      navigate('/login');
    } catch (error) {
      console.error('Register error', error);
      setError('Registration failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
<div className="relative w-full max-w-sm bg-slate-800 rounded-xl shadow-md p-6">
<div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r from-white via-teal-400 to-white" />

        <h1 className="text-center text-xl  rounded-t-xl font-bold tracking-wide text-white mb-4">
          REGISTER
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-normal"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-normal"
          />

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 tracking-wide rounded text-normal font-bold transition"
          >
            REGISTER
          </button>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
