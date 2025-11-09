import { useState } from 'react';
import puviyanLogo from '../assets/puviyan_logo.avif';
import mobileImage from '../assets/mobile_coins.png';
import coinsImage from '../assets/Coins.png';
import co2Badge from '../assets/Co-2.avif';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [successMsg, setSuccessMsg] = useState('');

  const handleNotifyMe = () => {
    if (email && email.trim().length > 0) {
      setStatus('success');
      setSuccessMsg('Awesome! You are now first in the list.');
    } else {
      setStatus('error');
      setSuccessMsg('');
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="w-4 h-4 object-contain" />
            <span
              className="text-white font-semibold"
              style={{ fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif', fontSize: '16px' }}
            >
              Puviyan
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 pb-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between relative">
          {/* Mobile Image Section */}
          <div className="flex-1 relative z-20 flex justify-center items-center overflow-visible min-h-[450px] lg:min-h-[550px] p-0 lg:mb-0">
            <img
              src={coinsImage}
              alt="Coins Background"
              className="absolute top-1/2 left-1/2 -translate-x-[64%] -translate-y-1/2 w-[100px] opacity-100 pointer-events-none z-10"
            />
            <img 
              src={mobileImage} 
              alt="Mobile App Preview" 
              className="relative z-20 max-w-full h-auto max-h-[700px]"
            />
          </div>

          {/* Text and CTA Section */}
          <div className="flex-1 lg:pl-12 flex flex-col justify-center text-center lg:text-left relative z-10 w-full lg:max-w-none">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
              style={{ fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif' }}
            >
              COMING SOON<br />
              TO REWRITE YOUR<br />
              ECOSTORY
            </h1>
            
            <p
              className="text-lg md:text-xl lg:text-2xl text-white/80 mb-10 font-light"
              style={{ fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif' }}
            >
              Be the first to grab the exclusive rewards!
            </p>

            <div className="flex flex-row gap-3 items-center justify-center lg:justify-center">
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
                className={`w-[240px] sm:w-[240px] md:w-[280px] lg:w-[300px] px-4 py-3 bg-white/5 border rounded-lg text-white text-sm tracking-wider text-center placeholder:text-white focus:outline-none focus:bg-white/8 transition-all ${status === 'error' ? 'border-red-500' : 'border-transparent'}`}
                style={{
                  background:
                    'linear-gradient(#000,#000) padding-box, linear-gradient(to bottom, #F9BB18, #74CFE6, #5ABA52) border-box',
                }}
              />
              <button 
                onClick={handleNotifyMe} 
                className="px-8 py-3 border-none rounded-lg text-white text-sm md:text-base font-bold tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(249,187,24,0.3)] hover:shadow-[0_6px_30px_rgba(249,187,24,0.5)] w-auto"
                style={{ background: 'linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)' }}
              >
                NOTIFY ME
              </button>
            </div>
            {status === 'success' && (
              <div
                className="mt-4 font-medium text-center lg:text-left"
                style={{
                  background: 'linear-gradient(90deg, #FABB15 0%, rgba(99, 222, 243, 0.99) 50%, #51B157 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
                  fontSize: '20px',
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
      <div className="fixed bottom-24 right-12 flex items-center gap-3 px-5 py-3 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md z-40"
         style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(#1f2937,rgb(12, 12, 12)), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '36px 14px 14px 36px',
          minWidth: '70px',
          minHeight: '28px',
         }}>
          <img src={co2Badge} alt="CO2 Footprint Icon" className="w-9 h-9" style={{ transform: 'rotate(-19deg)' }} />
        <div className="co2-text flex flex-col justify-center">
          <div className="main font-bold text-[0.73rem] text-white leading-tight">
            0.03 g of CO2e per page view
          </div>
          <div className="sub text-[0.73rem] text-gray-300 mt-0.5">
            98% lower than global average
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 text-center lg:text-left">
            <span className="text-sm text-white/60">© 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="/privacy" className="text-sm text-white/60 hover:text-primary">Privacy Policy</a>
              <a href="/terms" className="text-sm text-white/60 hover:text-primary">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex gap-5">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
