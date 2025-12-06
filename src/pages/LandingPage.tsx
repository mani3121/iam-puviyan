import { useState } from 'react';
import mobileImage from '../assets/iamPuviyan.png';
import downshade from '../assets/downshade.png';
import { submitEmail } from '../services/firebaseService';
import CarbonFootprintBanner from '../components/CarbonFootprintBanner';
import PageLayout from '../components/PageLayout';
import ContentWrapper from '../components/ContentWrapper';

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
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <PageLayout>
      {/* Main Content */}
      <main className="w-full flex-1 flex items-start justify-center overflow-hidden">
        <ContentWrapper maxWidth="desktop">
          <div className="flex flex-col-reverse lg:flex-row items-stretch justify-center min-h-[85vh] py-2 lg:py-4">
          {/* Mobile Image Section */}
          <div className="flex-1 flex justify-center items-start w-full overflow-hidden relative">
            <img 
              src={mobileImage} 
              alt="Mobile App Preview" 
              className="w-auto h-[125%] object-cover object-top -mt-[12%]"
            />
            <img 
              src={downshade} 
              alt="" 
              className="absolute top-[40%] left-0 w-full h-[65%] object-cover pointer-events-none" 
            />
          </div>

          {/* Text and CTA Section */}
          <div className="flex-1 w-full max-w-[90vw] lg:max-w-[45vw] flex flex-col justify-start pt-[15vh] lg:pt-[20vh] text-center lg:text-left relative z-10 lg:-ml-12 xl:-ml-12">
            <h1 
              className="font-light leading-tight mb-[2vh] tracking-wide"
              style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 100, lineHeight: 1.25, fontSize: 'clamp(1.5rem, 4vw, 4.2rem)' }}
            >
              <span className="text-white">COMING SOON</span><br />
              <span className="text-white">TO EMPOWER</span>
              <span className="text-[#48C84F] font-extrabold whitespace-nowrap block mt-[1.5vh]" style={{ fontSize: 'clamp(1.4rem, 3vw, 3.0rem)' }}>A SUSTAINABLE LIFESTYLE</span>
            </h1>
            
            <p 
              className="text-white font-extralight leading-tight mb-[2vh] tracking-wide"
              style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontWeight: 50, lineHeight: 1.33, fontSize: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}
            >
              Inviting changemakers to integrate the app into homes, workplaces, institutions, businesses, & communities everywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch justify-center lg:justify-start relative">
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
              {status === 'success' && (
                <p className="absolute top-full left-0 right-0 mt-2 text-sm sm:text-base text-[#5ABA52] font-light text-center lg:text-left">
                  Thank you for joining us. You'll hear from us soon.
                </p>
              )}
            </div>
          </div>
        </div>
        </ContentWrapper>
      </main>

      {/* Carbon Badge */}
      <CarbonFootprintBanner />

      {/* Footer */}
      <footer className="w-full border-t border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
        <ContentWrapper maxWidth="desktop">
          <div className="py-4 sm:py-5 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
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
        </ContentWrapper>
      </footer>
    </PageLayout>
  );
};

export default LandingPage;
