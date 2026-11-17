import { Roll, Stage, type Act } from './parts'
import './coa-clock.css'

// Schema page: the one rule a static schema can't check. A lab result tested
// Dec 1, 2025 passes GA-COA-GATE until the day it turns more than 365 days
// old, then fails, with nothing in the document changed.
// Beats (plays once in view): today rolls Nov 30 → Dec 1 → Dec 2, 2026; the
// age counts 364 → 365 → 366 days; on the last day the rule fails.
// Real strings: checkCoaGate's name and its two messages for this document
// (run with now set to each date).

type S = { day: number }
const initial: S = { day: 0 }
const poster: S = { day: 2 }
const DAYS = [
  { date: 'Nov 30, 2026', age: 364 },
  { date: 'Dec 1, 2026', age: 365 },
  { date: 'Dec 2, 2026', age: 366 },
]

async function script(a: Act<S>) {
  await a.wait(1200)
  a.put({ day: 1 })
  await a.wait(1100)
  a.put({ day: 2 })
  await a.wait(3200)
}

export default function CoaClock() {
  return (
    <Stage<S>
      width={560}
      height={340}
      compact={{ below: 480, width: 358, height: 380 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="gl gl-clock"
    >
      {(s) => {
        const d = DAYS[s.day]
        const ok = d.age <= 365
        return (
          <div className="ck-col">
            <div className="ck-card">
              <div className="ck-head">
                <span className="ck-file">lab_result</span>
                <span className="ck-today">Today <strong><Roll>{d.date}</Roll></strong></span>
              </div>
              <div className="ck-fact"><span>tested_at</span><code>"2025-12-01T00:00:00Z"</code></div>
              <div className="ck-fact"><span>Age</span><strong className="ck-num"><Roll>{String(d.age)}</Roll> days</strong></div>
              <div className="ck-fact"><span>Limit</span><strong className="ck-num">365 days</strong></div>
            </div>
            <div className="ck-card ck-result" data-fail={!ok || undefined}>
              <code className="ck-fn">checkCoaGate(pkg, now)</code>
              <div className="ck-line">
                <span className="ck-mark" data-fail={!ok || undefined} aria-hidden>
                  <svg viewBox="0 0 12 12" width="12" height="12">{ok ? <path d="M2.5 6.5l2.5 2.5 4.5-5.5" /> : <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />}</svg>
                </span>
                <code className="ck-id">GA-COA-GATE</code>
                <code className="ck-msg"><Roll variant="fade">{ok ? 'COA gate satisfied' : 'tested_at is more than 365 days old'}</Roll></code>
              </div>
            </div>
          </div>
        )
      }}
    </Stage>
  )
}
