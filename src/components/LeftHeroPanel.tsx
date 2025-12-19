import { useState, useEffect } from 'react'

interface Slide {
  imageUrl: string
  title: string
  highlight?: string
  subtitle: string
  description: string
}

interface LeftHeroPanelProps {
  slides: Slide[]
  autoRotate?: boolean
  intervalMs?: number
  className?: string
}

const LeftHeroPanel = ({ 
  slides, 
  autoRotate = true, 
  intervalMs = 6000, 
  className = '' 
}: LeftHeroPanelProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Skip auto-rotation if disabled or only 1 slide
    if (!autoRotate || slides.length <= 1) return

    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [autoRotate, slides.length, intervalMs, isHovered])

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  const currentSlide = slides[activeIndex]

  if (!currentSlide) return null

  return (
    <div 
      className={`relative w-full h-full flex flex-col justify-start ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section - Upper Portion */}
      <div className="relative w-full max-w-4xl mx-auto rounded-t-3xl overflow-hidden bg-black/70 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="w-full h-96 md:h-[28rem] lg:h-[40rem] object-cover transition-transform duration-700 ease-out scale-105"
        />
      </div>

      {/* Content Section - Lower Portion */}
      <div className="relative w-full max-w-4xl mx-auto rounded-b-3xl bg-black/70 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 md:p-10 text-center">
        {/* Title with optional highlight */}
        <h2 className="[font-family:'Segoe_UI_Variable'] text-[28px] font-semibold tracking-wide">
          {currentSlide.title}
          {currentSlide.highlight && (
            <span className="font-extrabold"> {currentSlide.highlight}</span>
          )}
        </h2>

        {/* Subtitle */}
        <p className="mt-0.5 [font-family:'Segoe_UI_Variable'] text-[28px] uppercase">
          {currentSlide.subtitle}
        </p>

        {/* Description */}
        <p className="mt-3 [font-family:'Segoe_UI_Variable'] text-[16px] text-neutral-300 max-w-xl mx-auto">
          {currentSlide.description}
        </p>

        {/* Pagination Dots */}
        {slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-400/60'
                    : 'w-2.5 h-2.5 rounded-full bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeftHeroPanel
