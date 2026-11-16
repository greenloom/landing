import { Button, Collapse, Roll, Stage, type Act } from './parts'
import './pause.css'

// Pauses: stop one delivery method without closing the store.
// Layout: the staff sheet on top, the shopper's view below it (stacked cards).
// Beats (plays once in view): the cursor ticks Local delivery → presses
// Pause methods → the banner shoppers see opens over the menu and Local
// delivery is marked paused; Pickup and Shipping stay open.
// Real strings: the sheet's title, "Methods to pause", the method names, the
// button, and the banner sentence shoppers get.

type S = { picked: boolean; paused: boolean }
const initial: S = { picked: false, paused: false }
const poster: S = { picked: true, paused: true }
const METHODS = ['Pickup', 'Local delivery', 'Shipping']

async function script(a: Act<S>) {
  await a.wait(1000)
  await a.click({ at: 'box', x: 0.5, y: 0.5 })
  a.put({ picked: true })
  await a.wait(700)
  await a.click({ at: 'pause', x: 0.75, y: 0.6 })
  a.put({ paused: true })
  await a.move(a.layout === 'compact' ? { x: 330, y: 400 } : { x: 520, y: 400 })
  await a.wait(2600)
}

export default function Pause() {
  return (
    <Stage<S>
      width={560}
      height={430}
      compact={{ below: 480, width: 358, height: 450 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 520, y: 400 }, compact: { x: 330, y: 420 } } }}
      className="gl gl-pause"
    >
      {(s) => (
        <div className="ps-col">
          <div className="ps-card">
            <div className="ps-head">
              <span className="ps-title">Pause methods</span>
              <Button size="large" variant={s.picked ? 'primary' : 'tertiary'} data-target="pause" data-locked={!s.picked || undefined}>{s.paused ? 'Paused' : 'Pause methods'}</Button>
            </div>
            <span className="ps-label">Methods to pause</span>
            <div className="ps-methods">
              {METHODS.map((m) => {
                const on = m === 'Local delivery' && s.picked
                return (
                  <span key={m} className="ps-method" data-cursor="pointer">
                    <span className="ps-box" data-target={m === 'Local delivery' ? 'box' : undefined} data-on={on || undefined}>
                      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden><path d="M2.5 6.5l2.5 2.5 4.5-5.5" /></svg>
                    </span>
                    {m}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="ps-card ps-shop">
            <span className="ps-crumb">What shoppers see</span>
            <Collapse open={s.paused} reveal="drop">
              <p className="ps-banner">Local delivery is paused right now. You can still browse and choose another method.</p>
            </Collapse>
            {METHODS.map((m) => {
              const off = m === 'Local delivery' && s.paused
              return (
                <div key={m} className="ps-row" data-off={off || undefined}>
                  <span>{m}</span>
                  <span className="ps-state"><Roll variant="fade">{off ? 'Paused' : 'Open'}</Roll></span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Stage>
  )
}
