import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './look.css'
import Workflow from './workflow'
import PriceBook from './price-book'
import Pause from './pause'

// Each [data-demo] slot in index.html holds a text fallback; the matching
// Stage replaces it. Stages handle their own in-view playback, pausing
// offscreen and showing their finished state under reduced motion.
const DEMOS: Record<string, ComponentType> = {
  workflow: Workflow,
  'price-book': PriceBook,
  pause: Pause,
}

for (const slot of document.querySelectorAll<HTMLElement>('[data-demo]')) {
  const Demo = DEMOS[slot.dataset.demo ?? '']
  if (!Demo) continue
  slot.textContent = ''
  createRoot(slot).render(<Demo />)
}
