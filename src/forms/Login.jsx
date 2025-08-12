import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.username);

      const roleObject = res.data.role;

      const activeRole = Object.keys(roleObject).find(
        (key) => roleObject[key] === 1
      );

      if (activeRole) {
        localStorage.setItem("role", activeRole);
      }

      if (!activeRole) {
        setError("Unexpected user role. Contact support.");
        return;
      }

      setError(null);

      switch (activeRole) {
        case "isAdmin":
          navigate("/adminDashboard", { replace: true });
          break;
        case "isStaff":
          navigate("/staffDashboard", { replace: true });
          break;
        case "isHr":
          navigate("/hrDashboard", { replace: true });
          break;
        default:
          navigate("/welcome", { replace: true });
      }
    } catch (error) {
      console.error("Login error", error);
      setError("Invalid username or password");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-800 border-t-4 border-teal-400 rounded-xl shadow-md p-6">
        <h1 className="text-center text-xl font-bold tracking-wide text-white mb-4">
          LOGIN
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
            LOG-IN
          </button>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
