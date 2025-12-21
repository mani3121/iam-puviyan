// import React from 'react'

interface Slide {
  imageUrl: string
  title: string
  highlight?: string
  subtitle: string
  // description: string
}

interface LeftHeroPanelProps {
  slides: Slide[]
  className?: string
}

const LeftHeroPanel = ({ 
  slides, 
  className = '' 
}: LeftHeroPanelProps) => {
  // Only use the first slide
  const firstSlide = slides[0]

  if (!firstSlide) return null

  return (
    <div 
      className={`relative w-full h-full flex flex-col justify-start ${className}`}
    >
      {/* Image Section - Upper Portion */}
      <div className="relative w-full max-w-4xl mx-auto rounded-t-3xl overflow-hidden bg-black/70 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        <img
          src={firstSlide.imageUrl}
          alt={firstSlide.title}
          className="w-full h-96 md:h-[28rem] lg:h-[40rem] object-cover"
        />
      </div>

      {/* Content Section - Lower Portion */}
      <div className="relative w-full max-w-4xl mx-auto rounded-b-3xl bg-[#1a1a1a] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 md:p-10 text-center">
        {/* Title with optional highlight */}
        <h2 className="[font-family:'Segoe_UI_Variable'] text-[32px] font-light">
          {firstSlide.title}
          {firstSlide.highlight && (
            <span className="font-light"> {firstSlide.highlight}</span>
          )}
        </h2>

        {/* Subtitle */}
        <p className=" [font-family:'Segoe_UI_Variable'] text-[24px] font-light">
          {firstSlide.subtitle}
        </p>

        {/* Description */}
        {/* <p className="mt-3 [font-family:'Segoe_UI_Variable'] text-[16px] text-neutral-300 max-w-xl mx-auto">
          {firstSlide.description}
        </p> */}
      </div>
    </div>
  )
}

export default LeftHeroPanel
