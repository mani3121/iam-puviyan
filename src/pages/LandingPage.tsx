import { useState, useEffect, useRef } from 'react';
import puviyanLogo from '../assets/puviyan_logo.avif';
import mobileImage from '../assets/Puvi_Image.png';
import backgroundCoins from '../assets/puvi_coins.png';
import co2Badge from '../assets/Co-2.avif';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [successMsg, setSuccessMsg] = useState('');
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const tiltCoinsRef = useRef<HTMLImageElement>(null);

  const handleNotifyMe = () => {
    if (email && email.trim().length > 0) {
      setStatus('success');
      setSuccessMsg('Awesome! You are now first in the list.');
    } else {
      setStatus('error');
      setSuccessMsg('');
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
    <div className="h-screen text-white relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50">
        <div className="max-w-8xl mx-auto px-6 lg:px-20 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="w-3 h-3 sm:w-4 sm:h-4 object-contain" />
            <span
              className="text-white font-semibold text-sm sm:text-base"
            >
              Puviyan
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-12 sm:pt-14 md:pt-16 pb-2 sm:pb-4 md:pb-6 flex-1 flex items-center">
        <div className="max-w-8xl mx-auto px-2 lg:px-20 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center relative gap-6">
          {/* Mobile Image Section */}
          <div className="flex-1 relative z-20 flex justify-center items-center overflow-visible min-h-[200px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[550px] p-0 lg:mb-0">
            <div 
              ref={tiltCardRef}
              className="relative w-full h-full flex justify-center items-center"
              style={{ perspective: '1000px' }}
            >
              {/* Background coins with tilt effect */}
              <div className="absolute inset-0 pointer-events-none">
                <img 
                  ref={tiltCoinsRef}
                  src={backgroundCoins}
                  alt="Background Coins"
                  className="absolute object-contain w-[220%] h-[220%] sm:w-[180%] sm:h-[180%] md:w-[150%] md:h-[150%] lg:w-[140%] lg:h-[140%]"
                  style={{ 
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.75)',
                    opacity: 0.9,
                    zIndex: 10,
                    transition: 'transform 0.1s ease-out',
                    willChange: 'transform'
                  }}
                />
              </div>
              {/* Main image - static */}
              <div className="relative z-20 mt-1 sm:mt-1 md:mt-2 lg:mt-0">
                <img 
                  src={mobileImage} 
                  alt="Mobile App Preview" 
                  className="relative max-w-full h-auto max-h-[250px] sm:max-h-[550px] md:max-h-[650px] lg:max-h-[600px]"
                  style={{ transform: 'scale(1.0)' }}
                />
              </div>
            </div>
          </div>

          {/* Text and CTA Section */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left relative z-10 w-full lg:max-w-none">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
            >
              COMING SOON<br />
              TO REWRITE YOUR<br />
              ECOSTORY
            </h1>
            
            <p
              className="text-sm sm:text-base md:text-lg lg:text-2xl text-white/80 mb-4 sm:mb-6 md:mb-10 font-light"
            >
              Be the first to grab the exclusive rewards!
            </p>

            <div className="flex flex-row gap-2 sm:gap-3 items-stretch justify-center lg:justify-start">
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
                className={`w-[140px] sm:w-[160px] md:w-[200px] lg:w-[240px] px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 bg-white/5 border rounded-lg text-white text-xs sm:text-sm tracking-wider text-center placeholder:text-white focus:outline-none focus:bg-white/8 transition-all ${status === 'error' ? 'border-red-500' : 'border-transparent'}`}
                style={{
                  background:
                    'linear-gradient(#000,#000) padding-box, linear-gradient(to bottom, #F9BB18, #74CFE6, #5ABA52) border-box',
                }}
              />
              <button 
                onClick={handleNotifyMe} 
                className="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 border-none rounded-lg text-white text-xs sm:text-sm md:text-base font-bold tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(249,187,24,0.3)] hover:shadow-[0_6px_30px_rgba(249,187,24,0.5)] w-auto flex items-center"
                style={{ background: 'linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)' }}
              >
                NOTIFY ME
              </button>
            </div>
            {status === 'success' && (
              <div
                className="mt-2 sm:mt-3 md:mt-4 font-small text-center lg:text-left text-sm sm:text-base md:text-lg lg:text-xl w-full max-w-none mx-auto lg:mx-0"
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
        <div className="co2-text flex flex-col justify-center">
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
        <div className="max-w-8xl mx-auto px-6 lg:px-20 py-2 sm:py-3 md:py-4 flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-center lg:text-left">
            <span className="text-xs sm:text-sm text-white/60">© 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</span>
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              <a href="/privacy" className="text-xs sm:text-sm text-white/60 hover:text-primary">Privacy Policy</a>
              <a href="/terms" className="text-xs sm:text-sm text-white/60 hover:text-primary">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-4 md:gap-5">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default LandingPage;
