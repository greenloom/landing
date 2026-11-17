import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './look.css'
import Workflow from './workflow'
import Closure from './closure'
import Thca from './thca'
import Validate from './validate'
import CoaClock from './coa-clock'
import Guide, { type StepText } from './guide/guide'
import { SCENES } from './guide/scenes'

// Each [data-demo] slot in index.html holds a text fallback; the matching
// Stage replaces it. Stages handle their own in-view playback, pausing
// offscreen and showing their finished state under reduced motion.
const DEMOS: Record<string, ComponentType<{ steps: StepText[] }>> = {
  workflow: Workflow,
  closure: Closure,
  thca: Thca,
  validate: Validate,
  'coa-clock': CoaClock,
  ...Object.fromEntries(Object.entries(SCENES).map(([k, v]) => [k, (p: { steps: StepText[] }) => <Guide scene={v.scene} label={v.label} steps={p.steps} />])),
}

for (const slot of document.querySelectorAll<HTMLElement>('[data-demo]')) {
  const Demo = DEMOS[slot.dataset.demo ?? '']
  if (!Demo) continue
  // Guide slots hold their steps as an <ol>: read them before the stage replaces it
  const steps = [...slot.querySelectorAll('li')].map((li) => {
    const name = li.querySelector('strong')?.textContent ?? ''
    return { name, text: (li.textContent ?? '').replace(name, '').trim() }
  })
  slot.textContent = ''
  createRoot(slot).render(<Demo steps={steps} />)
}
