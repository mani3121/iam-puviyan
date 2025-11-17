import { useState } from 'react';
import { submitEmail } from '../services/firebaseService';
import puviyanLogo from '../assets/puviyan_logo.avif';
import mobileImage from '../assets/mobile_coins.png';
import co2Badge from '../assets/Co-2.avif';

const TabletLandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [successMsg, setSuccessMsg] = useState('');

  const handleNotifyMe = async () => {
    if (!email || email.trim().length === 0) {
      setStatus('error');
      setSuccessMsg('');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setSuccessMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    
    const result = await submitEmail(email);
    
    if (result.success) {
      setStatus('success');
      setSuccessMsg(result.message);
      setEmail('');
    } else {
      setStatus('error');
      setSuccessMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      <header className="w-full fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="w-4 h-4 object-contain" />
            <span className="text-white font-semibold text-base">Puviyan</span>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 md:pt-20 pb-4 md:pb-6 flex-1 flex items-start">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col items-center justify-start gap-6 md:gap-8">
            {/* CTA on top */}
            <div className="w-full text-center mt-2 md:mt-3">
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4 md:mb-6 tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                COMING SOON<br />
                TO REWRITE YOUR<br />
                ECOSTORY
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 font-light">Be the first to grab the exclusive rewards!</p>
              <div className="flex flex-row gap-3 items-stretch justify-center">
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
                  className={`w-[220px] md:w-[260px] px-4 md:px-5 py-3 md:py-3.5 bg-white/5 border rounded-lg text-white text-sm md:text-base tracking-wider text-center placeholder:text-white focus:outline-none focus:bg:white/8 transition-all ${status === 'error' ? 'border-red-500' : 'border-transparent'}`}
                  style={{
                    background:
                      'linear-gradient(#000,#000) padding-box, linear-gradient(to bottom, #F9BB18, #74CFE6, #5ABA52) border-box',
                  }}
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={status === 'loading'}
                  className="px-5 md:px-6 py-3 md:py-3.5 border-none rounded-lg text-white text-sm md:text-base font-bold tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(249,187,24,0.3)] hover:shadow-[0_6px_30px_rgba(249,187,24,0.5)] w-auto flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)' }}
                >
                  {status === 'loading' ? 'SAVING...' : 'NOTIFY ME'}
                </button>
              </div>
              {(status === 'success' || status === 'error') && successMsg && (
                <div
                  className="mt-3 md:mt-4 font-small text-center text-base md:text-lg w-full"
                  style={{
                    background: 'linear-gradient(90deg, #FABB15 0%, rgba(99, 222, 243, 0.99) 50%, #51B157 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {successMsg}
                </div>
              )}
            </div>

            {/* Image at bottom */}
            <div className="w-full relative flex justify-center items-end min-h-[320px] mt-auto pb-1 md:pb-2">
              <img src={mobileImage} alt="Mobile App Preview" className="w-[78%] h-auto max-h-[480px] md:max-h-[560px]" />

              {/* Carbon Badge (compact) */}
              <div
                className="absolute bottom-1 right-3 md:bottom-2 md:right-6 flex items-center gap-1 px-2 py-1 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md z-40"
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
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ transform: 'rotate(-19deg)' }}
                />
                <div className="co2-text flex flex-col justify-center">
                  <div className="main font-bold text-[9px] md:text-[10px] text-white leading-tight">
                    0.03 g of CO2e per page view
                  </div>
                  <div className="sub text-[8px] md:text-[9px] text-gray-300 mt-0.5">
                    98% lower than global average
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer: full footer for tablet */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 md:py-4 flex flex-col md:flex-row flex-nowrap justify-between items-center gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 lg:gap-6 flex-nowrap text-center md:text-left">
            <span className="text-sm md:text-sm text-white/60 whitespace-nowrap overflow-hidden text-ellipsis">© 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</span>
            <div className="flex gap-4 md:gap-6 whitespace-nowrap">
              <a href="/privacy" className="text-sm text-white/60 hover:text-primary">Privacy Policy</a>
              <a href="/terms" className="text-sm text-white/60 hover:text-primary">Terms of Service</a>
            </div>
          </div>

          <div className="flex gap-4 md:gap-5 whitespace-nowrap">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.46c.49-.9 1.65-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="1"></circle>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TabletLandingPage;
