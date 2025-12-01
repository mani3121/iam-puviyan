import { useState } from 'react';
import mobileImage from '../assets/iamPuviyan.png';
import downshade from '../assets/downshade.png';
import { submitEmail } from '../services/firebaseService';
import CarbonFootprintBanner from '../components/CarbonFootprintBanner';

const LandingPage = () => {
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
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50 h-16 sm:h-20 md:h-24" style={{ backgroundColor: '#1a1a1a' }}>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[1540px] mx-auto px-28 lg:px-28 xl:px-32">
        <div className="flex flex-col-reverse lg:flex-row items-stretch justify-center h-[80vh]">
          {/* Mobile Image Section */}
          <div className="flex-1 flex justify-center items-start w-full overflow-hidden relative">
            <img 
              src={mobileImage} 
              alt="Mobile App Preview" 
              className="w-auto h-full object-cover object-top"
            />
            <img 
              src={downshade} 
              alt="" 
              className="absolute bottom-0 left-0 w-full h-[40%] object-cover pointer-events-none" 
            />
          </div>

          {/* Text and CTA Section */}
          <div className="flex-1 w-[280px] sm:w-[320px] md:w-[400px] lg:w-[500px] xl:w-[700px] flex flex-col justify-center text-center lg:text-left relative z-10 lg:-ml-12 xl:-ml-12">
            <br/><br/><br/><br/>
            <h1 
              className="text-[1.4rem] sm:text-[1.6rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] font-light leading-tight mb-3 sm:mb-4 md:mb-6 tracking-wide"
              style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 100, lineHeight: 1.25 }}
            >
              <span className="text-white">COMING SOON</span><br />
              <span className="text-white">TO EMPOWER</span>
              <span className="text-[#48C84F] font-extrabold text-[1.2rem] sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.2rem] xl:text-[2.6rem] whitespace-nowrap block mt-4">A SUSTAINABLE LIFESTYLE</span>
            </h1>
            
            <p 
              className="text-[0.875rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.3rem] xl:text-[1.5rem] text-white font-extralight leading-tight mb-4 md:mb-8"
              style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 100, lineHeight: 1.33 }}
            >
              Inviting changemakers to integrate the app into homes, workplaces, institutions, businesses, & communities everywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch justify-center lg:justify-start">
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
                className={`w-full sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] px-4 py-2 bg-transparent border-[1.5px] rounded-lg text-sm md:text-base text-center placeholder:text-[#DAF4DC] focus:outline-none focus:border-[#5ABA52] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#3AA03F]'}`}
                style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 400, lineHeight: 1.25 }}
              />
              <button 
                onClick={handleNotifyMe} 
                disabled={status === 'loading'}
                className="px-4 md:px-6 lg:px-8 py-3 md:py-4 hover:brightness-110 border-none rounded-lg text-white text-sm md:text-base font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", lineHeight: 1.25, backgroundColor: '#48C84F' }}
              >
                {status === 'loading' ? 'SAVING...' : 'GET EARLY ACCESS'}
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
      <CarbonFootprintBanner />

      {/* Footer */}
      <footer className="w-full border-t border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-20 py-4 sm:py-5 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-3">
              <a href="/terms" className="text-stone-300 text-sm font-normal hover:text-white transition-colors" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", lineHeight: '24px' }}>Terms of Service</a>
              <div className="w-px h-4 bg-stone-300"></div>
              <a href="/privacy" className="text-stone-300 text-sm font-normal hover:text-white transition-colors" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", lineHeight: '24px' }}>Privacy Policy</a>
            </div>
          </div>
          <div className="flex justify-center items-center gap-1">
            <span className="text-stone-300 text-sm font-normal" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", lineHeight: '24px' }}>All rights reserved</span>
            <span className="text-stone-300 text-sm font-normal" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", lineHeight: '24px' }}>© 2025 Puviyan Digital Solutions Private Limited</span>
          </div>
          
          <div className="flex gap-4 sm:gap-5">
            <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/100 transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/100 transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/100 transition-colors flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="1"></circle>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/100 transition-colors flex items-center justify-center">
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
