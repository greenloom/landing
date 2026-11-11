import { Check, Connector, Stage, States, type Act, type Rect } from './parts'
import { Glyph, type GlyphName } from './glyph'
import './flow.css'

// The chain one sale depends on, as a diagram. A system story, no cursor
// (gold: payout-flow): each step clears in turn, the line to the next draws
// once it has, and the last check lands at the counter.
// Plays once in view; the poster is every step cleared.
// Real strings: the five step names and what each one confirmed.

type S = { step: number }
const initial: S = { step: 0 }
const poster: S = { step: 5 }

const STEPS: { name: string; done: string; icon: GlyphName }[] = [
  { name: 'Lab result', done: 'COA in date', icon: 'flask' },
  { name: 'Listing', done: 'Published', icon: 'store' },
  { name: 'Stock', done: '2 held', icon: 'package' },
  { name: 'Order', done: 'Paid · 21+', icon: 'receipt' },
  { name: 'Handoff', done: 'ID checked', icon: 'id' },
]

async function script(a: Act<S>) {
  await a.wait(900)
  for (let i = 1; i <= STEPS.length; i++) {
    a.mark(`step-${i}`)
    a.put({ step: i })
    await a.wait(i === STEPS.length ? 0 : 1050)
  }
  await a.wait(2400)
}

// The point where a line leaves one node and meets the next, by layout
const exit = (r: Rect, compact: boolean) => (compact ? { x: r.x + 34, y: r.y + r.height } : { x: r.x + r.width, y: r.y + r.height / 2 })
const entry = (r: Rect, compact: boolean) => (compact ? { x: r.x + 34, y: r.y } : { x: r.x, y: r.y + r.height / 2 })

export default function Flow() {
  return (
    <Stage<S>
      width={1040}
      height={152}
      compact={{ below: 760, width: 350, height: 560 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="gl gl-flow"
    >
      {(s, rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <ol className="fl-steps">
              {STEPS.map((step, i) => {
                const done = s.step > i
                return (
                  <li key={step.name} className="fl-node" data-target={`n${i}`} data-done={done || undefined}>
                    <span className="fl-icon"><Glyph name={step.icon} size={16} /></span>
                    <span className="fl-text">
                      <span className="fl-name">{step.name}</span>
                      <span className="fl-state">
                        <Check on={done} size={14} />
                        {/* Both labels share one cell that holds the longer, so the
                            line never empties or resizes as it changes */}
                        <States value={done ? 'done' : 'wait'} align="start" states={{ wait: 'Waiting', done: step.done }} />
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
            {STEPS.slice(0, -1).map((_, i) => {
              const from = rect(`n${i}`)
              const to = rect(`n${i + 1}`)
              if (!from.width || !to.width) return null
              return (
                <Connector
                  key={i}
                  show={s.step > i + 1}
                  from={exit(from, compact)}
                  to={entry(to, compact)}
                  route="straight"
                  dots="none"
                  className="fl-line"
                />
              )
            })}
          </>
        )
      }}
    </Stage>
  )
}
