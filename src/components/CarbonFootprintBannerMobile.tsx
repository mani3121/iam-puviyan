import { useEffect, useState } from 'react';
import co2Badge from '../assets/Co-2.avif';
import { compareToBaseline, simplifiedCO2PerView } from '../utils/carbon';

interface CarbonFootprintBannerMobileProps {
  co2Estimate: number;
}

// Constant page weight in MB (28KB = 0.028MB)
function getPageWeightMB(): number {
  return 0.028;
}

const CarbonFootprintBannerMobile: React.FC<CarbonFootprintBannerMobileProps> = ({ co2Estimate: propCo2Estimate }) => {
  const [co2Estimate, setCo2Estimate] = useState(propCo2Estimate);
  const [comparison, setComparison] = useState('');

  const calculateCarbonFootprint = () => {
    const effectiveMB = getPageWeightMB();

    const { gramsCO2 } = simplifiedCO2PerView(effectiveMB, {
      energyPerGB_kWh: 0.405,
      carbonIntensity_gPerkWh: 475,
    });

    const baseline_g = 0.70;
    const { label } = compareToBaseline(gramsCO2, baseline_g);

    setCo2Estimate(gramsCO2);
    setComparison(label);
  };

  useEffect(() => {
    calculateCarbonFootprint();
  }, []);

  return (
    <div className="fixed bottom-20 right-2 z-50">
      <div 
        className="co2-badge flex items-center gap-1.5 pl-2 py-1 bg-black text-center pr-2"
        style={{
          width: 'auto',
          height: '38px',
          border: '1px solid transparent',
          backgroundImage: 'linear-gradient(black, black), linear-gradient(to right, #F9BB18, #74CFE6, #5ABA52)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '50px 5px 5px 50px',
        }}
      >
      <div className="co2-icon flex flex-col items-center flex-shrink-0">
        <img src={co2Badge} alt="CO2 Icon" style={{ width: '18px', height: '22px', transform: 'rotate(-14.596deg)' }} />
      </div>
      <div className="co2-text flex flex-col">
        <div className="main font-bold text-[8px] text-white leading-tight whitespace-nowrap">{co2Estimate.toFixed(2)}g of CO2e per page view</div>
        <div className="sub text-[8px] text-gray-300 leading-tight whitespace-nowrap">{comparison}</div>
      </div>
      </div>
    </div>
  );
};

export default CarbonFootprintBannerMobile;
