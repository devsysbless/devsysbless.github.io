import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section" id="faq">
      <div className="container container-narrow">
        <SectionHead eyebrow="FAQ" title="Pertanyaan yang sering ditanyakan" />

        <div className="faq reveal">
          {FAQ.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q} className={`faq-item ${open ? 'is-open' : ''}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  aria-controls={`faq-a-${i}`}
                >
                  {item.q}
                  <ChevronDown size={20} />
                </button>
                <div className="faq-a" id={`faq-a-${i}`} role="region">
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
