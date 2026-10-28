import Image from "next/image";
import { Header } from "@/components/Header";
import { RequestAccessForm } from "@/components/RequestAccessForm";

export default function Home() {
  return (
    <>
      {/* RESPONSIVE HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="w-full pt-28 sm:pt-32 pb-20 overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 md:pt-20 pb-16 text-center relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[220px] sm:h-[320px] bg-secondary/5 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-outline-variant/60 bg-surface-container-low/70 mb-8 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-[11px] sm:text-xs font-medium tracking-wide text-on-surface-variant">
              SeekPro 3.0 • Cognitive Operating System
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-on-surface leading-[1.15] sm:leading-[1.12]">
            Command your focus.
            <br />
            <span className="bg-gradient-to-r from-on-surface via-primary to-secondary bg-clip-text text-transparent">
              Seamlessly.
            </span>
          </h1>

          {/* Concise Subheadline */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-on-surface-variant max-w-xl mx-auto font-normal leading-relaxed px-2">
            The minimal executive operating system that quietly deflects interruptions, harmonizes
            your daily calendar, and preserves cognitive flow.
          </p>

          {/* Minimal CTA Row */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-secondary hover:text-[#002112] transition-all shadow-[0_0_25px_rgba(80,223,156,0.2)]"
              href="#request-access"
            >
              <span>Request Early Access</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
          <p className="mt-4 text-xs text-outline tracking-normal px-4">
            Private cohort · On-device cryptographic privacy · No cloud lock-in
          </p>
        </section>

        {/* CLEAN VISUAL SHOWCASE: SINGLE MINIMALIST MOCKUP CARD */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-20 sm:mb-28">
          <div className="relative rounded-2xl bg-surface-container-low/80 border border-outline-variant/70 p-5 sm:p-10 shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Subtle corner glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Window bar */}
            <div className="flex items-center justify-between pb-5 sm:pb-6 border-b border-outline-variant/40 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2a322e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2a322e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2a322e]" />
                <span className="ml-2 font-mono text-[10px] sm:text-[11px] text-outline tracking-wider truncate max-w-[150px] sm:max-w-none">
                  SEEKPRO://ENCLAVE_ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[11px] sm:text-xs text-secondary font-medium tracking-wide">
                  SHIELDED
                </span>
              </div>
            </div>

            {/* Unified Minimalist Preview Layout */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-2 sm:py-4">
              {/* Left: Daily Alignment Line */}
              <div className="flex-1 space-y-3 text-left w-full">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  Autonomous Day Briefing
                </div>
                <h3 className="font-headline text-lg sm:text-xl text-on-surface font-semibold">
                  Cognitive Flow Preserved
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  3 schedule collisions reconciled. Morning focus block locked for 2 hours and 45
                  minutes with zero interruptions.
                </p>
                <div className="inline-flex items-center gap-2 pt-2 text-xs text-outline font-mono">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    lock
                  </span>
                  Zero-knowledge local whisper model standing by
                </div>
              </div>

              {/* Center: Clean Focus Dial */}
              <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-surface-container/60 border border-outline-variant/50 w-full md:w-auto min-w-[200px]">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container-highest/60"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="5"
                    />
                    <circle
                      className="text-secondary transition-all duration-1000"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="currentColor"
                      strokeDasharray="264"
                      strokeDashoffset="80"
                      strokeLinecap="round"
                      strokeWidth="5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                      01:45
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-outline uppercase tracking-wider">
                      Deep Work
                    </span>
                  </div>
                </div>
                <span className="mt-3 text-xs text-on-surface-variant font-medium">
                  Capital Allocation Sync
                </span>
              </div>

              {/* Right: Acoustic Waveform */}
              <div className="w-full md:w-48 flex flex-col items-start md:items-end justify-center space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">
                  Voice Presence
                </span>
                <div className="w-full h-10 px-3 rounded-xl bg-surface-container flex items-center justify-between gap-1 border border-outline-variant/40">
                  <span className="w-1 bg-secondary rounded-full h-2" />
                  <span className="w-1 bg-secondary rounded-full h-5" />
                  <span className="w-1 bg-primary rounded-full h-7" />
                  <span className="w-1 bg-secondary rounded-full h-3" />
                  <span className="w-1 bg-primary rounded-full h-6" />
                  <span className="w-1 bg-secondary rounded-full h-2" />
                  <span className="w-1 bg-secondary rounded-full h-4" />
                </div>
                <span className="text-[11px] text-outline font-mono">140ms acoustic latency</span>
              </div>
            </div>
          </div>
        </section>

        {/* MINIMAL 3-FEATURE VALUE GRID */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 mb-20 sm:mb-28 scroll-mt-24" id="focus">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-headline text-2xl sm:text-3xl font-semibold tracking-tight text-on-surface">
              Designed for stillness and clarity.
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant">
              Three sovereign foundations that quietly redefine daily productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between hover:border-outline-variant/80 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 sm:mb-6">
                  <span className="material-symbols-outlined text-[20px]">timelapse</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Deep Focus
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Distraction-free flow pacing with intelligent shielding. Uninterrupted cognitive
                  energy defended throughout your peak hours.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between hover:border-outline-variant/80 transition-colors scroll-mt-24"
              id="assistant"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 sm:mb-6">
                  <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Voice Concierge
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  On-device natural speech delegation in milliseconds. Dictate executive actions
                  and adjust commitments without touching the keyboard.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between hover:border-outline-variant/80 transition-colors scroll-mt-24"
              id="security"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 sm:mb-6">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Sovereign Privacy
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Zero-knowledge on-device enclave with total cryptographic ownership. Your
                  sensitive memos and schedules never train external models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT NUMBERS: 3-STAT STRIP */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 mb-20 sm:mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/40 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/60 py-4 sm:py-6">
            <div className="p-5 sm:p-6 text-center">
              <div className="font-headline text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight">
                4+ <span className="text-secondary text-2xl">hrs</span>
              </div>
              <div className="text-xs text-outline uppercase tracking-wider mt-2 font-medium">
                Deep Work Reclaimed Daily
              </div>
            </div>
            <div className="p-5 sm:p-6 text-center">
              <div className="font-headline text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight">
                90<span className="text-secondary text-2xl">%</span>
              </div>
              <div className="text-xs text-outline uppercase tracking-wider mt-2 font-medium">
                Distractions Autonomously Silenced
              </div>
            </div>
            <div className="p-5 sm:p-6 text-center">
              <div className="font-headline text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight">
                100<span className="text-secondary text-2xl">%</span>
              </div>
              <div className="text-xs text-outline uppercase tracking-wider mt-2 font-medium">
                On-Device Sovereign Privacy
              </div>
            </div>
          </div>
        </section>

        {/* MINIMAL PRICING / ACCESS INVITATION */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 mb-20 sm:mb-28 scroll-mt-24" id="pricing">
          <div className="p-6 sm:p-12 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-md">
              <div className="inline-block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                Reserved Licensure
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-on-surface">
                Executive Seat Allocation
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Full access to SeekPro desktop engine, private calendar reconciliation, and
                zero-knowledge acoustic assistant. Simple monthly membership with dedicated
                concierge support.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
                  $39
                </span>
                <span className="text-xs text-outline font-medium">/ month</span>
              </div>
              <span className="text-xs text-outline mt-1 mb-4">
                Cancel anytime · Enterprise fleet discounts available
              </span>
              <a
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-secondary hover:text-[#002112] transition-colors"
                href="#request-access"
              >
                Reserve License
              </a>
            </div>
          </div>
        </section>

        {/* REFINED MINIMALIST CTA SECTION */}
        <section className="max-w-2xl mx-auto px-5 sm:px-8 text-center scroll-mt-24" id="request-access">
          <h2 className="font-headline text-2xl sm:text-3xl font-semibold tracking-tight text-on-surface">
            Elevate your cognitive bandwidth.
          </h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            Join the private cohort. Reserve your executive allocation today.
          </p>
          <RequestAccessForm />
        </section>
      </main>

      {/* CLEAN MINIMAL FOOTER */}
      <footer className="w-full border-t border-outline-variant/30 py-8 sm:py-10 bg-[#080a0a]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/seekpro_logo.png"
              alt="SeekPro Logo"
              width={20}
              height={20}
              className="h-5 w-auto object-contain opacity-80"
            />
            <span className="text-xs text-outline font-medium">
              © 2025 SeekPro Technologies Inc. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-outline">
            <a className="hover:text-on-surface transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Security
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
