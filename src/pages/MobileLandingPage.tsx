import { useState } from 'react';
import puviyanLogo from '../assets/puviyan_logo.avif';
import mobileImage from '../assets/mobile_coins.png';
import co2Badge from '../assets/Co-2.avif';

const MobileLandingPage = () => {
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
    <div className="h-screen text-white relative overflow-hidden flex flex-col">
      <header className="w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="w-3 h-3 object-contain" />
            <span className="text-white font-semibold text-sm">Puviyan</span>
          </div>
        </div>
      </header>

      <main className="w-full pt-10 sm:pt-14 pb-0 flex-1 flex items-start">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col items-center justify-between gap-2">
            {/* CTA on top */}
            <div className="w-full max-w-[300px] sm:max-w-[320px] mx-auto self-center text-left translate-x-6 sm:translate-x-8">
              <h1 className="text-2xl font-black leading-tight mb-2 tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                COMING SOON TO<br />
                REWRITE YOUR<br />
                ECOSTORY
              </h1>
              <p className="text-xs text-white/80 mb-3 font-light">Be the first to grab the exclusive rewards!</p>
              <div className="flex w-full gap-2 items-stretch justify-start">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmail(v);
                    if (v.trim().length > 0 && status === 'error') {
                      setStatus('idle');
                    }
                  }}
                  className={`w-[150px] sm:w-[160px] px-2 py-1.5 bg-white/5 border rounded-lg text-white text-[10px] tracking-wider text-left placeholder:text-[9px] placeholder:text-white focus:outline-none focus:bg-white/8 transition-all ${status === 'error' ? 'border-red-500' : 'border-transparent'}`}
                  style={{
                    background:
                      'linear-gradient(#000,#000) padding-box, linear-gradient(to bottom, #F9BB18, #74CFE6, #5ABA52) border-box',
                  }}
                />
                <button
                  onClick={handleNotifyMe}
                  className="px-2 py-1 border-none rounded-lg text-white text-[9px] font-bold tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(249,187,24,0.3)] hover:shadow-[0_6px_30px_rgba(249,187,24,0.5)] w-auto flex items-center"
                  style={{ background: 'linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)' }}
                >
                  NOTIFY ME
                </button>
              </div>
              {status === 'success' && (
                <div
                  className="mt-2 font-small text-left text-sm w-full"
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

            {/* Mobile image at bottom */}
            <div className="w-full flex justify-center items-center min-h-[200px] mt-6 sm:mt-8 mb-1">
              <img src={mobileImage} alt="Mobile App Preview" className="w-[92%] sm:w-[94%] h-auto max-h-[44vh] sm:max-h-[50vh]" />
            </div>
          </div>
        </div>
      </main>

      {/* Carbon Badge (compact) */}
      <div
        className="fixed bottom-16 right-2 sm:bottom-20 sm:right-4 flex items-center gap-1 px-2 py-1 bg-black/60 border border-primary/30 rounded-full backdrop-blur-md z-40"
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
          className="w-4 h-4 sm:w-5 sm:h-5"
          style={{ transform: 'rotate(-19deg)' }}
        />
        <div className="co2-text flex flex-col justify-center">
          <div className="main font-bold text-[9px] sm:text-[10px] text-white leading-tight">
            0.03 g of CO2e per page view
          </div>
          <div className="sub text-[8px] sm:text-[9px] text-gray-300 mt-0.5">
            98% lower than global average
          </div>
        </div>
      </div>

      {/* Footer: copyright only for mobile */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center items-center">
          <span className="text-[10px] text-white/60 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">© 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
