"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/store/cart-context";

export default function SignUpPage() {
  const router = useRouter();
  const { syncGuestCartToDb } = useCart();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", ok: form.password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(form.password) },
    { label: "Passwords match", ok: form.password === form.confirmPassword && form.confirmPassword !== "" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Register
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        toast.error(regData.error || "Registration failed.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created but sign-in failed. Please sign in manually.");
        router.push("/auth/signin");
        return;
      }

      // Sync guest cart → DB
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.id) {
        await syncGuestCartToDb(session.user.id);
      }

      toast.success("Account created! Welcome to Lumen.");
      router.push("/account");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-16 text-background w-full">
          <Link href="/" className="text-3xl font-heading font-semibold tracking-wide">
            LUMEN
          </Link>
          <div>
            <h2 className="text-3xl font-heading leading-snug mb-4">
              Join the Lumen community.
            </h2>
            <p className="text-background/60 text-sm">
              Get access to exclusive offers, EMI plans, and order tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 overflow-y-auto">
        <Link href="/" className="lg:hidden text-2xl font-heading font-semibold tracking-wide text-foreground mb-12">
          LUMEN
        </Link>

        <Link href="/" className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-heading text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground mb-10">Start your Lumen journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="Jane Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div className="space-y-1.5 pt-1">
                  {passwordChecks.map(({ label, ok }) => (
                    <div key={label} className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-green-600" : "text-muted-foreground"}`}>
                      <Check className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-30"}`} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Confirm password
              </label>
              <input
                id="signup-confirm-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
