import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ProblemFinder from './components/ProblemFinder.jsx'
import Services from './components/Services.jsx'
import Principles from './components/Principles.jsx'
import Journey from './components/Journey.jsx'
import VisionMission from './components/VisionMission.jsx'
import Process from './components/Process.jsx'
import Faq from './components/Faq.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { startTracking } from './lib/api.js'

export default function App() {
  useEffect(() => {
    startTracking()
  }, [])

  // Animasi muncul saat elemen ber-class "reveal" masuk layar
  useEffect(() => {
    const items = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemFinder />
        <Services />
        <Principles />
        <Journey />
        <VisionMission />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
