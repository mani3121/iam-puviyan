import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import MobileLandingPage from './pages/MobileLandingPage'
import TabletLandingPage from './pages/TabletLandingPage'
import ContactPage from './pages/ContactPage'

function Home() {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App
