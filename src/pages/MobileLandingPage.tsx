import { useEffect, useState } from 'react';
import downshade from '../assets/downshade.png';
import mobileImage from '../assets/iamPuviyan.png';
import CarbonFootprintBannerMobile from '../components/CarbonFootprintBannerMobile';
import { submitEmail } from '../services/firebaseService';
import PageLayout from '../components/PageLayout';
import ContentWrapper from '../components/ContentWrapper';

const MobileLandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
    <PageLayout>
      <main className="w-full pt-[10vh] pb-16 flex-1 flex items-start justify-center overflow-hidden">
        <ContentWrapper maxWidth="mobile" className="origin-top scale-[0.955] sm:scale-95">
          <div className="flex flex-col items-center justify-between gap-2">
            {/* CTA on top */}
            <div className="w-full max-w-[350px] mx-auto self-center text-center flex flex-col gap-2">
              <h1 className="font-thin leading-tight tracking-wide flex flex-col gap-[0.5vh] items-center" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 100, lineHeight: 1.25 }}>
                 <span className="text-white whitespace-nowrap" style={{ display: 'block', fontSize: 'clamp(1.1rem, 5.5vw, 1.5rem)', fontWeight: 100, lineHeight: 1.2, marginBottom: '6px', letterSpacing: '0.1em' }}>COMING SOON TO EMPOWER</span>
                 <span className="text-[#48C84F] whitespace-nowrap" style={{ display: 'block', fontSize: 'clamp(1.2rem, 6.5vw, 1.75rem)', fontWeight: 700, lineHeight: 1.2 }}>A SUSTAINABLE LIFESTYLE</span>
              </h1>
                <p className="text-white leading-relaxed mt-[0.5vh]" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontSize: 'clamp(0.65rem, 3vw, 0.875rem)', fontWeight: 100, lineHeight: 1.4 }}>Inviting changemakers to integrate the app into homes, workplaces, institutions, businesses, and communities everywhere.</p>
              <div className="flex flex-row gap-2 items-stretch justify-center mt-2" style={{ width: 'fit-content', margin: '0.5rem auto 0' }}>
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
                  className={`flex-1 px-3 py-2 bg-transparent border-[0.5px] rounded-md text-white text-center placeholder:text-white/80 focus:outline-none focus:border-[#48c84f] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#48c84f]'}`}
                  style={{ fontFamily: "'Segoe UI Variable', sans-serif", fontSize: 'clamp(0.5rem, 2.5vw, 0.75rem)', minWidth: '70%' }}
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={status === 'loading'}
                  className="px-6 py-2 border-none rounded-md text-white font-medium tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ fontFamily: "'Segoe UI Variable', sans-serif", fontWeight: 400, backgroundColor: '#48C84F', fontSize: 'clamp(0.45rem, 2.2vw, 0.7rem)' }}
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
            <div className="w-full flex justify-center items-start flex-1 mb-0 overflow-hidden">
              <img
                src={mobileImage}
                alt="Mobile App Preview"
                loading="lazy"
                decoding="async"
                className="w-[90%] h-auto scale-120"
              /> 
              <img 
                src={downshade} 
                alt="" 
                loading="lazy"
                decoding="async"
                className="absolute top-[69%] left-0 w-full h-[30%] object-cover pointer-events-none" 
              />
            </div>
          </div>
        </ContentWrapper>
      </main>

      {/* Carbon Footprint Banner Mobile */}
      <CarbonFootprintBannerMobile co2Estimate={0} />

      {/* Footer */}
      <footer className="w-full bg-[#1a1a1a] fixed bottom-0 left-0">
        <ContentWrapper maxWidth="mobile">
          <div className="py-3 flex flex-col items-center gap-2">
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
          <div className="flex items-center gap-2 text-[8px] text-white/40">
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <span>All rights reserved</span>
          </div>
          <span className="text-[8px] text-white/40"> 2025 Puviyan Digital Solutions Private Limited</span>
        </div>
      </ContentWrapper>
    </footer>
  </PageLayout>
  );
};

export default MobileLandingPage;
