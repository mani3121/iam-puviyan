import { useState } from 'react';
import mobileImage from '../assets/iamPuviyan.png';
import downshade from '../assets/downshade.png';
import CarbonFootprintBannerMobile from '../components/CarbonFootprintBanner';
import { submitEmail } from '../services/firebaseService';
import PageLayout from '../components/PageLayout';
import ContentWrapper from '../components/ContentWrapper';

const TabletLandingPage = () => {
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
    <PageLayout>
      <main className="w-full pt-16 md:pt-20 pb-0 flex-1 flex items-start">
        <ContentWrapper maxWidth="tablet" className="h-full flex flex-col">
          {/* Top section - CTA */}
          <div className="flex-shrink-0">
            <div className="w-full text-center mt-0 mb-0">
              <h1 className="font-light leading-tight mb-4 md:mb-4 tracking-wide" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif" }}>
                <span className="text-white whitespace-nowrap" style={{ display: 'block', fontSize: '44px', fontStyle: 'normal', fontWeight: 300, lineHeight: '52px' }}>COMING SOON TO EMPOWER</span>
                <span className="text-[#5ABA52] whitespace-nowrap" style={{ display: 'block', fontSize: '52px', fontStyle: 'normal', fontWeight: 700, lineHeight: '62px' }}>A SUSTAINABLE LIFESTYLE</span>
              </h1>
              <p className="text-white/70 mt-4 mb-2 md:mb-3 max-w-2xl mx-auto" style={{ fontFamily: "'Segoe UI Variable', system-ui, sans-serif", fontSize: '20px', fontStyle: 'normal', fontWeight: 300, lineHeight: '28px' }}>Inviting changemakers to integrate the app into homes, workplaces,<br/> institutions, businesses, & communities everywhere.</p>
              <div className="flex flex-row gap-3 items-stretch justify-center mt-6">
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
                  className={`w-[220px] md:w-[300px] px-4 md:px-5 py-3 md:py-3.5 bg-transparent border-2 rounded-lg text-white text-sm md:text-base placeholder:text-white/40 focus:outline-none focus:border-[#5ABA52] transition-all ${status === 'error' ? 'border-red-500' : 'border-[#5ABA52]'}`}
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={status === 'loading'}
                  className="px-5 md:px-7 py-3 md:py-3.5 bg-[#5ABA52] hover:bg-[#4da847] border-none rounded-lg text-white text-sm md:text-base font-bold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {status === 'loading' ? 'SAVING...' : 'GET EARLY ACCESS'}
                </button>
              </div>
              {status === 'success' && (
                <p className="mt-1 md:mt-2 text-sm md:text-base text-[#5ABA52] font-light text-center">
                  Thank you for joining us. You'll hear from us soon.
                </p>
              )}
            </div>
          </div>

          {/* Bottom section - Image */}
          <div className="flex-1 flex justify-center mt-4 md:mt-6 relative overflow-hidden">
            <img src={mobileImage} alt="Mobile App Preview" className="w-[85%] max-h-[90vh] md:max-h-[100vh] object-contain scale-125 transition-transform duration-300 ease-out" />
            <img
              src={downshade}
              alt=""
              className="absolute top-[70%] left-0 w-full h-[30%] object-cover pointer-events-none"
            />
          </div>
        </ContentWrapper>
      </main>

      {/* Carbon Badge */}
      <CarbonFootprintBannerMobile />

      {/* Footer */}
      <footer className="w-full border-t border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
        <ContentWrapper maxWidth="tablet">
          <div className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 flex-nowrap text-center md:text-left">
              <div className="flex gap-3 md:gap-4 whitespace-nowrap">
                <a href="/terms" className="text-[10px] md:text-xs text-white/60 hover:text-white transition-colors">Terms of Service</a>
                <a href="/privacy" className="text-[10px] md:text-xs text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              </div>
              <span className="text-[10px] md:text-xs text-white/60 whitespace-nowrap overflow-hidden text-ellipsis">All rights reserved 2025 Puviyan Digital Solutions Private Limited</span>
            </div>

            <div className="flex gap-3 md:gap-4 whitespace-nowrap">
              <a href="https://x.com/PuviyanDigital" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
                <svg width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/people/Puviyan-Digital-Solutions/61577303789280/#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
                <svg width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/puviyandigitalsolutions/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
                <svg width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.46c.49-.9 1.65-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/puviyandigitalsolutions/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
                <svg width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="1"></circle>
                </svg>
              </a>
            </div>
          </div>
        </ContentWrapper>
      </footer>
    </PageLayout>
  );
};

export default TabletLandingPage;
