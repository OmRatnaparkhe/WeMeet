import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Video,
  Mic,
  Share2,
  Shield,
  Zap,
  Globe,
  Play,
  Download
} from "lucide-react";
import { usePWAInstall } from "../components/usePWAInstall";

export function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
      <Navbar />

      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>

      <Footer />
    </div>
  );
}


function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { isInstallable, installApp } = usePWAInstall();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">WeMeet</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          {isInstallable && (
            <button
              onClick={installApp}
              // Change "hidden md:flex" to "flex"
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition"
            >
              <Download className="w-4 h-4" />
              {/* Optional: Hide text on mobile to save space, show icon only */}
              <span className="hidden sm:inline">Install App</span>
              {/* Or keep it simple: just "Install App" if you have space */}
            </button>
          )}
          {!isSignedIn && (
            <button
              onClick={() => navigate("/signin")}
              className="text-sm font-medium text-white/70 hover:text-white transition"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => navigate(isSignedIn ? "/dashboard" : "/signup")}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-neutral-200 transition"
          >
            {isSignedIn ? "Go to Studio" : "Get Started"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection({ onGetStarted }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-6">
            New: Local Recording Engine 2.0
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Your Remote Studio,<br /> Professional Quality.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Record crystal-clear video and audio locally, independent of internet quality.
            The modern alternative to Zoom for creators and professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-lg transition shadow-lg shadow-blue-600/25"
            >
              Start Recording Free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl blur-lg" />
          <div className="relative bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="h-8 bg-neutral-800 border-b border-white/5 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="aspect-[16/9] bg-neutral-950 relative flex items-center justify-center group cursor-default">
              <div className="grid grid-cols-2 gap-4 p-8 w-full h-full opacity-50 group-hover:opacity-100 transition duration-700">
                <div className="bg-neutral-800 rounded-lg animate-pulse" />
                <div className="bg-neutral-800 rounded-lg animate-pulse delay-75" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/50 backdrop-blur border border-white/10 px-6 py-3 rounded-full text-sm font-medium">
                  High Fidelity Local Recording
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Video className="w-6 h-6 text-blue-400" />,
      title: "4K Local Recording",
      desc: "We record video directly on each user's device, ensuring glitch-free quality even with bad wifi."
    },
    {
      icon: <Mic className="w-6 h-6 text-purple-400" />,
      title: "Separate Audio Tracks",
      desc: "Get individual WAV files for every participant. Perfect for post-production editing."
    },
    {
      icon: <Share2 className="w-6 h-6 text-green-400" />,
      title: "Instant Cloud Sync",
      desc: "Recordings upload automatically to your dashboard as soon as the session ends."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Ultra Low Latency",
      desc: "Real-time communication powered by WebRTC optimized for natural conversation."
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: "Secure by Design",
      desc: "End-to-end encryption for calls and secure storage for your valuable content."
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      title: "Browser Based",
      desc: "No downloads required. Guests join with a single click link from any browser."
    }
  ];

  return (
    <section id="features" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to create</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Built for podcasters, educators, and remote teams who refuse to compromise on quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 hover:border-white/10 transition group"
            >
              <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    "Create a Studio Room",
    "Invite Guests via Link",
    "Record & Download"
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              It's as easy as sharing a link.
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Forget complicated software setups. WeMeet handles the technical heavy lifting so you can focus on the conversation.
            </p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-lg font-medium">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative z-10 rotate-3 hover:rotate-0 transition duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700" />
                  <div>
                    <div className="h-2 w-24 bg-gray-700 rounded mb-1" />
                    <div className="h-2 w-16 bg-gray-800 rounded" />
                  </div>
                </div>
                <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold animate-pulse">
                  REC 00:12:43
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-32 w-full bg-neutral-800 rounded-lg" />
                <div className="h-32 w-full bg-neutral-800 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onGetStarted }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-blue-900/20 to-neutral-900 border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your content?</h2>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of creators capturing studio-quality video from their browser. No credit card required.
        </p>

        <button
          onClick={onGetStarted}
          className="px-10 py-4 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-lg transition transform hover:scale-105"
        >
          Get Started for Free
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Video className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-lg">WeMeet</span>
          </div>
          <p className="text-white/40 max-w-xs">
            The professional remote recording studio in your browser. Record locally, edit globally.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-white/50">
            <li><a href="#" className="hover:text-white transition">Features</a></li>
            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition">Showcase</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-white/50">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
        © 2026 WeMeet Inc. All rights reserved.
      </div>
    </footer>
  );
}