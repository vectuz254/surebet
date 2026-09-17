import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';
const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

export default function App() {
  const [email, setEmail] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Custom requestAnimationFrame-based crossfade system (resumes from current opacity)
  const fadeTo = (target: number, duration: number = FADE_MS) => {
    const video = videoRef.current;
    if (!video) return;

    // Interrupt any running animation frame to prevent competing fades
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const from = parseFloat(video.style.opacity || '0');
    if (from === target) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      video.style.opacity = String(from + (target - from) * t);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch(() => {});
      fadeTo(1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      // Trigger 500ms fade-out when 0.55s remain before video end
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      video.style.opacity = '0';

      // Reset to 0 after 100ms, play, and fade back in
      timeoutRef.current = setTimeout(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-between selection:bg-white/20 selection:text-white">
      {/* Full-screen Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Navigation bar (relative z-20, padding pl-6 pr-6 py-6) */}
      <nav className="relative z-20 pl-6 pr-6 py-6 w-full">
        {/* Inner container: rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto */}
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          {/* Left side: Logo area with Globe icon & "Asme" + nav links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white">
              <Globe size={24} className="text-white" />
              <span className="font-semibold text-lg tracking-tight">Asme</span>
            </div>

            {/* Desktop Nav links (hidden on mobile, shown on md:) */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                About
              </a>
            </div>
          </div>

          {/* Right side (gap-4): "Sign Up" plain text & "Login" liquid-glass button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-white hover:text-white/80 text-sm font-medium transition-colors cursor-pointer"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero content area (relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        {/* Heading with Instrument Serif */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        {/* max-w-xl w-full space-y-4 container */}
        <div className="max-w-xl w-full space-y-4">
          {/* Email input bar */}
          <form
            onSubmit={handleSubmit}
            className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Submit email"
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Subtitle text */}
          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          {/* Manifesto button (centered) */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Read the manifesto
            </button>
          </div>
        </div>
      </main>

      {/* Social icons footer (relative z-10 flex justify-center gap-4 pb-12) */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
        >
          <Twitter size={20} />
        </a>
        <a
          href="https://asme.example.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Globe"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
        >
          <Globe size={20} />
        </a>
      </footer>
    </div>
  );
}