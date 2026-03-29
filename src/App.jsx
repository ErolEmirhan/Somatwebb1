import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import Order from './pages/Order'
import ScrollToTop from './components/ScrollToTop'
import SEOHead from './components/SEOHead'
import InstagramFloatingButton from './components/InstagramFloatingButton'
import ReservationFloatingButton from './components/ReservationFloatingButton'
import LocationFloatingButton from './components/LocationFloatingButton'
import SplashScreen from './components/SplashScreen'

function AppContent() {
  const [buttonsCollapsed, setButtonsCollapsed] = useState(true)
  const [showButtons, setShowButtons] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const footerThreshold = documentHeight * 0.9
      setShowButtons(scrollTop + windowHeight < footerThreshold)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  return (
    <>
      <ScrollToTop />
      <SEOHead />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/hakkimizda" element={<About />} />
              <Route path="/galeri" element={<Gallery />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/order" element={<Order />} />
              <Route path="/iletisim" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          pointerEvents: buttonsCollapsed ? 'none' : 'auto',
        }}
      >
        <motion.div
          animate={{
            x: buttonsCollapsed ? 'calc(100% - 20px)' : 0,
            opacity: buttonsCollapsed ? 0 : 1,
            pointerEvents: buttonsCollapsed ? 'none' : 'auto',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col gap-3 items-end"
        >
          <LocationFloatingButton />
          <ReservationFloatingButton />
          <InstagramFloatingButton />
        </motion.div>

        <motion.button
          onClick={() => setButtonsCollapsed(!buttonsCollapsed)}
          whileTap={{ scale: 0.95 }}
          className={`${buttonsCollapsed ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-gold' : 'bg-gray-700'} text-white p-3 rounded-full shadow-2xl transition-all duration-300 relative z-10`}
          style={{ pointerEvents: 'auto' }}
        >
          {buttonsCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </div>
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = () => {
    setTimeout(() => setShowSplash(false), 500)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" onFinish={handleSplashFinish} />}
      </AnimatePresence>
      {!showSplash && <AppContent />}
    </>
  )
}

export default App
