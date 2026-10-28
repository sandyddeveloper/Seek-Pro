"use client";

import { useState } from "react";

export function RequestAccessForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className={`mt-8 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto transition-opacity ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          <input
            className="w-full px-5 py-3 rounded-full bg-surface-container-high border border-outline-variant/60 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-colors"
            placeholder="executive@enterprise.com"
            required
            type="email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full sm:w-auto whitespace-nowrap px-6 py-3 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-secondary hover:text-[#002112] transition-all shadow-[0_0_20px_rgba(80,223,156,0.15)] disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Request Access"}
          </button>
        </form>
      ) : (
        <div className="mt-8 p-4 rounded-2xl bg-surface-container-low border border-secondary/30 text-xs text-secondary font-medium flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Invitation dispatched. Our concierge will verify your credentials shortly.</span>
        </div>
      )}
    </div>
  );
}

