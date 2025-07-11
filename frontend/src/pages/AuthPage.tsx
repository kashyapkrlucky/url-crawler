import { Mail, Lock, User, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useAuth } from "../contexts/AuthProvider";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = isSignup
        ? { name, email, password }
        : { email, password };
      const endpoint = isSignup ? "/register" : "/login";

      const { data } = await axios.post(endpoint, payload);
      login(data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/guest-login");
      login(data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-12 rounded-lg shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isSignup
              ? "Sign up to start managing your links."
              : "Sign in to access your dashboard."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-500 flex items-center gap-1"
              >
                <User size={16} /> Name
              </label>
              <input
                id="name"
                required
                type="text"
                className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-500 flex items-center gap-1"
            >
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              required
              type="email"
              className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-500 flex items-center gap-1"
            >
              <Lock size={16} /> Password
            </label>
            <input
              id="password"
              required
              type="password"
              className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex justify-center items-center gap-2"
            disabled={loading}
          >
            {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
          </button>

          {!isSignup && (
            <button
              type="button"
              onClick={guestLogin}
              className="w-full py-2 border border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-medium mt-2"
              disabled={loading}
            >
              Continue as Guest
            </button>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <a href="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <a href="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
