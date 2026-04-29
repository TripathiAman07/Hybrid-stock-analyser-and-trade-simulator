import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import CandlestickAnimation from "@/components/CandlestickAnimation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const destination = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isSignUp) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 grid-pattern" />
        <CandlestickAnimation />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-2xl font-bold leading-tight">
            Where <span className="text-gradient-mint">data</span> meets <span className="text-gradient-purple">intuition</span>
          </p>
          <p className="text-muted-foreground text-sm mt-2">Sign in to access your Quantyx dashboard.</p>
        </div>
      </motion.div>

      <div className="lg:hidden relative overflow-hidden h-40 flex items-center justify-center bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative text-center px-6">
          <p className="text-xl font-bold">Where <span className="text-gradient-mint">data</span> meets <span className="text-gradient-purple">intuition</span></p>
          <p className="text-muted-foreground text-xs mt-1">Institutional-grade tools for the Indian stock market.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8"
      >
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </button>
            <ThemeToggle />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{isSignUp ? "Create account" : "Welcome back"}</h1>
          <p className="text-muted-foreground mb-6 text-sm">{isSignUp ? "Start your trading journey with Quantyx" : "Sign in to access your dashboard"}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                required
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Mail className="w-4 h-4" /> {submitting ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-primary hover:underline font-medium">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
