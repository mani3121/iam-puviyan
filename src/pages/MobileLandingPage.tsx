import { useState } from 'react';
import co2Badge from '../assets/Co-2.avif';
import mobileImage from '../assets/shade.png';
import downshade from '../assets/downshade.png';
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
      <header className="w-full top-0 left-0 z-50 bg-[#1a1a1a] h-10">
      </header>

      <main className="w-full pt-10 sm:pt-14 pb-0 flex-1 flex items-start">
        <div className="max-w-7xl mx-auto px-4 w-full origin-top scale-[1.08] sm:scale-100">
          <div className="flex flex-col items-center justify-between gap-2">
            {/* CTA on top */}
            <div className="w-full max-w-[300px] mx-auto self-center text-center flex flex-col gap-4">
              <h1 className="font-light leading-tight tracking-wide flex flex-col gap-4 items-center">
                <span className="text-[#E0F8FD] font-light text-xl whitespace-nowrap" style={{ fontFamily: "'Segoe UI Variable', sans-serif", fontWeight: 50 }}>COMING SOON TO EMPOWER</span>
                <span className="text-[#48C84F] font-black text-2xl whitespace-nowrap" style={{ fontFamily: "'Segoe UI Variable', sans-serif", fontWeight: 950 }}>A SUSTAINABLE LIFESTYLE</span>
              </h1>
              <p className="text-sm text-white font-light leading-5" style={{ fontFamily: "'Segoe UI Variable', sans-serif" }}>Inviting changemakers to integrate the app into homes, workplaces, institutions, businesses, and communities everywhere.</p>
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
                  className={`w-[150px] px-2 py-2 bg-transparent border-2 rounded-lg text-white text-[10px] placeholder:text-white/40 focus:outline-none focus:border-[#48c84f] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#48c84f]'}`}
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={status === 'loading'}
                  className="px-3 py-2 bg-[#48c84f] hover:bg-[#48c84f] border-none rounded-lg text-white text-[10px] font-light tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {status === 'loading' ? 'SAVING...' : 'GET EARLY ACCESS'}
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
              <img src={mobileImage} alt="Mobile App Preview" className="w-[90%] h-auto max-h-[45vh] scale-125" />
              <img 
                src={downshade} 
                alt="" 
                className="absolute top-[75%] left-0 w-full h-[30%] object-cover pointer-events-none" 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Carbon Badge (compact) */}
      <div className="w-full flex justify-end px-2 py-2">
        <div
          className="flex items-center gap-1 px-2 py-1 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md"
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
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#1a1a1a] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="1"></circle>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/40">
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <span>All rights reserved</span>
          </div>
          <span className="text-[10px] text-white/40">© 2025 Puviyan Digital Solutions Private Limited</span>
        </div>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
