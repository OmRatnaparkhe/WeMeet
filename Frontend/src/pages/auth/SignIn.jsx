import { useNavigate } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-white">
      <div className="w-[360px] bg-white/5 border border-white/10 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-4">Welcome back</h1>

        <input
          placeholder="Email"
          className="w-full mb-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full mb-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
        />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-2 rounded-lg"
        >
          Login
        </button>

        <p className="text-sm text-white/60 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
