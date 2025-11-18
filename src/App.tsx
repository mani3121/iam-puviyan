import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import MobileLandingPage from './pages/MobileLandingPage'
import TabletLandingPage from './pages/TabletLandingPage'

function App() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (width < 768) {
    return <MobileLandingPage />
  }

  if (width < 1200) {
    return <TabletLandingPage />
  }

  return <LandingPage />
}

export default App
