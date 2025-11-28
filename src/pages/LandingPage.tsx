import { useEffect, useRef, useState } from 'react';
import co2Badge from '../assets/Co-2.avif';
import puviyanLogo from '../assets/Logo.png';
import mobileImage from '../assets/Puvi_Image.png';
import backgroundCoins from '../assets/puvi_coins.png';
import { submitEmail } from '../services/firebaseService';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [successMsg, setSuccessMsg] = useState('');
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const tiltCoinsRef = useRef<HTMLImageElement>(null);

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

  useEffect(() => {
    const card = tiltCardRef.current;
    const coins = tiltCoinsRef.current;
    if (!card || !coins) return;

    let rafId: number | null = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isHovering = false;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

      coins.style.transform = `translate(-50%, -50%) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${isHovering ? 0.75 : 0.75})`;

      rafId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;

      targetRotateX = rotateX;
      targetRotateY = rotateY;
    };

    const handlePointerEnter = () => {
      isHovering = true;
    };

    const handlePointerLeave = () => {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
    };

    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener('pointerleave', handlePointerLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
        <div className="w-full py-3 sm:py-4">
          <div className="flex items-center justify-center cursor-pointer">
            <div className="flex items-center gap-3 sm:gap-4">
              <img src={puviyanLogo} alt="Puviyan Logo" className="h-8 sm:h-12 md:h-16 w-auto object-contain" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 flex-1 flex items-center">
        <div className="max-w-8xl mx-auto px-4 lg:px-20 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center relative gap-8 lg:gap-12">
          {/* Mobile Image Section */}
          <div className="flex-1 relative z-20 flex justify-center items-center min-h-[200px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[550px] p-0 lg:mb-0">
            <div 
              ref={tiltCardRef}
              className="relative w-full h-full flex justify-center items-center"
              style={{ perspective: '1000px' }}
            >
              {/* Unified container for both images */}
              <div className="relative flex justify-center items-center w-full h-full">
                {/* Background coins with tilt effect */}
                <img 
                  ref={tiltCoinsRef}
                  src={backgroundCoins}
                  alt="Background Coins"
                  className="absolute max-w-none object-contain pointer-events-none"
                  style={{ 
                    top: '44%',
                    left: '50%',
                    // Viewport-based sizing keeps coverage consistent at every breakpoint
                    width: 'min(75.65vw, 750px)',
                    height: 'auto',
                    transform: 'translate(-50%, -50%) scale(0.1)',
                    opacity: 0.9,
                    zIndex: 10,
                    transition: 'transform 0.1s ease-out',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',     // prevent GPU flicker on 3D tilt
                    transformOrigin: '50% 50%'
                  }}
                />
                {/* Main mobile image - static */}
                <img 
                  src={mobileImage} 
                  alt="Mobile App Preview" 
                  className="relative max-w-full h-auto max-h-[250px] sm:max-h-[550px] md:max-h-[650px] lg:max-h-[600px] mt-1 sm:mt-1 md:mt-2 lg:mt-0"
                  style={{ transform: 'scale(1.0)', zIndex: 20 }}
                />
              </div>
            </div>
          </div>

          {/* Text and CTA Section */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left relative z-10 w-full lg:max-w-none">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-3 sm:mb-4 md:mb-6 tracking-wide">
              <span className="text-white font-light">COMING SOON</span><br />
              <span className="text-white font-light">TO EMPOWER</span><br />
              <span className="text-[#5ABA52] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl whitespace-nowrap">A SUSTAINABLE LIFESTYLE</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-4 sm:mb-6 md:mb-8 font-medium max-w-2xl">
              Inviting changemakers to integrate the app into homes,<br className="hidden lg:block" />
              workplaces, institutions, businesses, & communities everywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch justify-center lg:justify-start max-w-2xl">
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
                className={`w-full sm:w-auto sm:min-w-[250px] md:min-w-[280px] px-4 py-3 sm:px-5 sm:py-4 bg-transparent border-2 rounded-lg text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-none focus:border-[#5ABA52] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#5ABA52]'}`}
              />
              <button 
                onClick={handleNotifyMe} 
                disabled={status === 'loading'}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-[#5ABA52] hover:bg-[#4da847] border-none rounded-lg text-white text-sm sm:text-base font-bold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {status === 'loading' ? 'SAVING...' : 'NOTIFY ME'}
              </button>
            </div>
            {status === 'success' && (
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#5ABA52] font-light text-center lg:text-left">
                Thank you for joining us. You'll hear from us soon.
              </p>
            )}
          </div>
        </div>
        </div>
      </main>

      {/* Carbon Badge */}
      <div className="fixed bottom-28 sm:bottom-32 md:bottom-36 lg:bottom-24 right-2 sm:right-6 md:right-12 flex items-center gap-1 sm:gap-2 md:gap-3 px-2 py-1 sm:px-3 sm:py-2 md:px-5 md:py-3 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md z-40"
        style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(#1f2937,rgb(12, 12, 12)), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '36px 14px 14px 36px',
          minWidth: '50px',
          minHeight: '20px',
         }}>
          <img src={co2Badge} alt="CO2 Footprint Icon" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" style={{ transform: 'rotate(-19deg)' }} />
        <div className="co2-text flex flex-col justify-center" style={{ fontFamily: 'Segoe UI Variable, system-ui, sans-serif' }}>
          <div className="main font-bold text-[0.5rem] sm:text-[0.6rem] md:text-[0.73rem] text-white leading-tight">
            0.03 g of CO2e per page view
          </div>
          <div className="sub text-[0.5rem] sm:text-[0.6rem] md:text-[0.73rem] text-gray-300 mt-0.5">
            98% lower than global average
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-8xl mx-auto px-6 lg:px-20 py-4 sm:py-5 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center lg:text-left">
            <div className="flex gap-4 sm:gap-6">
              <a href="/terms" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="/privacy" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <span className="text-xs sm:text-sm text-white/60">All rights reserved © 2025 Puviyan Digital Solutions Private Limited</span>
          </div>
          
          <div className="flex gap-4 sm:gap-5">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="1"></circle>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
