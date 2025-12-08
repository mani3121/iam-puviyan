import { useEffect, useRef, useState } from 'react';
import CarbonFootprintBannerMobile from './CarbonFootprintBannerMobile';
import { simplifiedCO2PerView, compareToBaseline, getTransferredBytes } from '../utils/carbon';
import co2Badge from '../assets/Co-2.avif';

// Constant page weight in MB (28KB = 0.028MB)
function getPageWeightMB(): number {
  return 0.028;
}

const CarbonFootprintBanner = () => {
  const [co2Estimate, setCo2Estimate] = useState(0);
  const [comparison, setComparison] = useState('');
  const bannerRef = useRef<HTMLDivElement>(null);

  const calculateCarbonFootprint = () => {
    const effectiveMB = getPageWeightMB();
    const calculatedPageWeightKB = Number((effectiveMB * 1024).toFixed(2));

    const { gramsCO2 } = simplifiedCO2PerView(effectiveMB, {
      energyPerGB_kWh: 0.405,
      carbonIntensity_gPerkWh: 475,
    });

    const baseline_g = 0.70;
    const { label } = compareToBaseline(gramsCO2, baseline_g);

    setCo2Estimate(gramsCO2);
    setComparison(label);

    // Log in development
    if (import.meta.env.DEV) {
      const actualBytes = getTransferredBytes();
      console.log('[Carbon] Using constant page weight:', calculatedPageWeightKB, 'KB');
      console.log('[Carbon] Actual transferred (all resources):', (actualBytes / 1024).toFixed(2), 'KB');
      console.log('[Carbon] CO2 estimate:', gramsCO2.toFixed(3), 'g');
    }
  };

  useEffect(() => {
    // Animate banner entrance
    if (bannerRef.current) {
      bannerRef.current.style.opacity = '0';
      bannerRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (bannerRef.current) {
          bannerRef.current.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
          bannerRef.current.style.opacity = '1';
          bannerRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }

    // Calculate carbon footprint after a delay to ensure resources are loaded
    const timer = setTimeout(() => {
      calculateCarbonFootprint();
    }, 1000);

    // Also recalculate when page is fully loaded
    window.addEventListener('load', calculateCarbonFootprint);
    

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', calculateCarbonFootprint);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-28 sm:bottom-32 md:bottom-24 lg:bottom-24 right-6 sm:right-8 md:right-4 lg:right-16 xl:right-20 z-40 origin-bottom-right scale-[0.75] sm:scale-[0.8] md:scale-[0.85] lg:scale-[0.9] xl:scale-100"
      style={{ 
        fontFamily: 'Segoe UI Variable, system-ui, sans-serif',
      }}
    >
      {/* Tablet-only banner (md, hidden on lg+) */}
      <div
        className="co2-badge items-center justify-center gap-2 px-3 py-2 bg-gray-900 relative hidden md:flex lg:hidden shadow-lg"
        style={{
          border: '1px solid transparent',
          backgroundImage:
            'linear-gradient(#1f2937,rgb(12, 12, 12)), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '24px 6px 6px 24px',
          minWidth: '84px',
          minHeight: '36px',
          transform: 'translate(8px, 8px)'
        }}
      >
        <div className="co2-icon flex items-center justify-center">
          <img src={co2Badge} alt="CO2 Footprint Icon" className="w-9 h-9" style={{ transform: 'rotate(-14deg)' }} />
        </div>
        <div className="co2-text flex flex-col justify-center">
          <div className="main text-white" style={{ fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px' }}>
            {co2Estimate.toFixed(2)} g of CO2e per page view
          </div>
          <div className="sub text-gray-300 mt-0.5" style={{ fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px' }}>
            {comparison || '—'}
          </div>
        </div>
      </div>

      {/* Desktop-only banner (lg+) */}
      <div
        className="co2-badge items-center justify-center gap-2 px-3 py-2 bg-gray-900 relative hidden lg:flex shadow-lg"
        style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(#1f2937,rgb(12, 12, 12)), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '36px 6px 6px 36px',
          minWidth: '88px',
          minHeight: '28px',
        }}
      >
        <div className="co2-icon flex flex-col items-center justify-center">
          <img src={co2Badge} alt="CO2 Footprint Icon" className="w-9 h-9" style={{ transform: 'rotate(-18deg)' }} />
        </div>
        <div className="co2-text flex flex-col justify-center">
          <div className="main font-bold text-[0.73rem] text-white leading-tight">
            {co2Estimate.toFixed(2)} g of CO2e per page view
          </div>
          <div className="sub text-[0.73rem] text-gray-300 mt-0.5">
            {comparison || '—'}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:flex md:hidden">
        <CarbonFootprintBannerMobile co2Estimate={co2Estimate} />
      </div>
    </div>
  );
};

export default CarbonFootprintBanner;
