import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './look.css'
import CoaBlock from './coa-block'
import HandoffGate from './handoff-gate'
import Loyalty from './loyalty'
import Flow from './flow'
import Label from './label'
import StockReason from './stock-reason'

// Each [data-demo] slot in index.html holds a one-line text fallback; the
// matching Stage replaces it. Stages handle their own in-view playback,
// pausing offscreen and showing their poster under reduced motion.
const DEMOS: Record<string, ComponentType> = {
  'coa-block': CoaBlock,
  'handoff-gate': HandoffGate,
  loyalty: Loyalty,
  flow: Flow,
  label: Label,
  'stock-reason': StockReason,
}

for (const slot of document.querySelectorAll<HTMLElement>('[data-demo]')) {
  const Demo = DEMOS[slot.dataset.demo ?? '']
  if (!Demo) continue
  slot.textContent = ''
  createRoot(slot).render(<Demo />)
}
