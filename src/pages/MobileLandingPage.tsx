import { useState } from 'react';
import co2Badge from '../assets/Co-2.avif';
import puviyanLogo from '../assets/Logo.png';
import mobileImage from '../assets/Puvi_Image.png';
import { submitEmail } from '../services/firebaseService';

const MobileLandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  const handleNotifyMe = async () => {
    if (!email || email.trim().length === 0) {
      setStatus('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    const result = await submitEmail(email);
    
    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="h-screen text-white relative overflow-hidden flex flex-col">
      <header className="w-full top-0 left-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
        <div className="w-full py-3">
          <div className="flex items-center justify-center cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </header>

      <main className="w-full pt-10 sm:pt-14 pb-0 flex-1 flex items-start">
        <div className="max-w-7xl mx-auto px-4 w-full origin-top scale-[1.08] sm:scale-100">
          <div className="flex flex-col items-center justify-between gap-2">
            {/* CTA on top */}
            <div className="w-full max-w-[300px] mx-auto self-center text-center">
              <h1 className="font-light leading-tight mb-2 tracking-wide">
                <span className="text-white font-light text-sm whitespace-nowrap">COMING SOON TO EMPOWER</span><br />
                <span className="text-[#5ABA52] font-bold text-xl whitespace-nowrap">A SUSTAINABLE LIFESTYLE</span>
              </h1>
              <p className="text-xs text-white/70 mb-3 font-medium">Inviting changemakers to integrate the app into homes, workplaces, institutions, businesses, & communities everywhere.</p>
              <div className="flex flex-row gap-2 items-stretch justify-center">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ID"
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmail(v);
                    if (v.trim().length > 0 && status === 'error') {
                      setStatus('idle');
                    }
                  }}
                  className={`w-[150px] px-2 py-2 bg-transparent border-2 rounded-lg text-white text-[10px] placeholder:text-white/40 focus:outline-none focus:border-[#5ABA52] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#5ABA52]'}`}
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={status === 'loading'}
                  className="px-3 py-2 bg-[#5ABA52] hover:bg-[#4da847] border-none rounded-lg text-white text-[10px] font-bold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {status === 'loading' ? 'SAVING...' : 'NOTIFY ME'}
                </button>
              </div>
              {status === 'success' && (
                <p className="mt-3 text-xs text-[#5ABA52] font-light text-center">
                  Thank you for joining us. You'll hear from us soon.
                </p>
              )}
            </div>

            {/* Mobile image at bottom */}
            <div className="w-full flex justify-center items-center min-h-[200px] mt-4 mb-1">
              <img src={mobileImage} alt="Mobile App Preview" className="w-[90%] h-auto max-h-[45vh]" />
            </div>
          </div>
        </div>
      </main>

      {/* Carbon Badge (compact) */}
      <div
        className="fixed bottom-16 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md z-40"
        style={{
          border: '1.5px solid transparent',
          backgroundImage:
            'linear-gradient(#1f2937,rgb(12, 12, 12)), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '28px 10px 10px 28px',
          minWidth: '44px',
          minHeight: '18px',
        }}
      >
        <img
          src={co2Badge}
          alt="CO2 Footprint Icon"
          className="w-4 h-4"
          style={{ transform: 'rotate(-19deg)' }}
        />
        <div className="co2-text flex flex-col justify-center" style={{ fontFamily: 'Segoe UI Variable, system-ui, sans-serif' }}>
          <div className="main font-bold text-[8px] text-white leading-tight">
            0.03 g of CO2e per page view
          </div>
          <div className="sub text-[7px] text-gray-300 mt-0.5">
            98% lower than global average
          </div>
        </div>
      </div>

      {/* Footer: copyright only for mobile */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col items-center gap-2">
          <div className="flex gap-3">
            <a href="/terms" className="text-[9px] text-white/60 hover:text-white transition-colors">Terms of Service</a>
            <a href="/privacy" className="text-[9px] text-white/60 hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <span className="text-[9px] text-white/60 text-center">All rights reserved © 2025 Puviyan Digital Solutions Private Limited</span>
        </div>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
