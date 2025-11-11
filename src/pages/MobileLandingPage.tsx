import { useState } from 'react';
import puviyanLogo from '../assets/puviyan_logo.avif';
import mobileImage from '../assets/mobile_coins.png';

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
      <header className="w-full fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={puviyanLogo} alt="Puviyan Logo" className="w-3 h-3 object-contain" />
            <span className="text-white font-semibold text-sm">Puviyan</span>
          </div>
        </div>
      </header>

      <main className="w-full pt-12 pb-2 flex-1 flex items-start">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col items-center justify-start gap-4">
            {/* CTA on top */}
            <div className="w-full text-center">
              <h1 className="text-2xl font-black leading-tight mb-3 tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                COMING SOON<br />
                TO REWRITE YOUR<br />
                ECOSTORY
              </h1>
              <p className="text-sm text-white/80 mb-4 font-light">Be the first to grab the exclusive rewards!</p>
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
                  className={`w-[160px] px-3 py-2 bg-white/5 border rounded-lg text-white text-xs tracking-wider text-center placeholder:text-white focus:outline-none focus:bg-white/8 transition-all ${status === 'error' ? 'border-red-500' : 'border-transparent'}`}
                  style={{
                    background:
                      'linear-gradient(#000,#000) padding-box, linear-gradient(to bottom, #F9BB18, #74CFE6, #5ABA52) border-box',
                  }}
                />
                <button
                  onClick={handleNotifyMe}
                  className="px-4 py-2 border-none rounded-lg text-white text-sm font-bold tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(249,187,24,0.3)] hover:shadow-[0_6px_30px_rgba(249,187,24,0.5)] w-auto flex items-center"
                  style={{ background: 'linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)' }}
                >
                  NOTIFY ME
                </button>
              </div>
              {status === 'success' && (
                <div
                  className="mt-2 font-small text-center text-sm w-full"
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
            <div className="w-full flex justify-center items-center min-h-[240px]">
              <img src={mobileImage} alt="Mobile App Preview" className="max-w-full h-auto max-h-[320px]" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer: copyright only for mobile */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center items-center">
          <span className="text-xs text-white/60">© 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
