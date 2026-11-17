import { Button, Collapse, Roll, Stage, type Act } from './parts'
import './closure.css'

// Legal closure: stop selling everywhere at once; reopening takes two people.
// Layout: the staff card on top, what shoppers see below it.
// Beats (plays once in view):
//   1. The store is taking orders on every method.
//   2. The cursor starts a legal closure: the staff card turns to the closed
//      callout and the shopper banner opens over the menu.
//   3. The cursor approves reopening: 1 of 2, and the store says it stays
//      closed until a different person approves. That is where it holds.
// Real strings: the trigger, the callout, the approvals line, the button,
// the second-approval sentence and the shopper banner.

type S = { closed: boolean; approved: boolean }
const initial: S = { closed: false, approved: false }
const poster: S = { closed: true, approved: true }

async function script(a: Act<S>) {
  await a.wait(1100)
  a.mark('close')
  await a.click({ at: 'close', x: 0.7, y: 0.6 })
  a.put({ closed: true })
  await a.wait(1700)
  a.mark('approve')
  await a.click({ at: 'approve', x: 0.7, y: 0.6 })
  a.put({ approved: true })
  await a.move(a.layout === 'compact' ? { x: 336, y: 470 } : { x: 530, y: 440 })
  await a.wait(2600)
}

export default function Closure() {
  return (
    <Stage<S>
      width={560}
      height={452}
      compact={{ below: 480, width: 358, height: 500 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 530, y: 424 }, compact: { x: 336, y: 470 } } }}
      className="gl gl-closure"
    >
      {(s) => (
        <div className="cl-col">
          <div className="cl-card">
            <span className="cl-crumb">Storefront · Marsh Lane Hemp</span>
            <Collapse open={!s.closed}>
              <div className="cl-open">
                <span className="cl-title">Taking orders on every method</span>
                <Button size="medium" variant="danger" data-target="close">Start a legal closure</Button>
              </div>
            </Collapse>
            <Collapse open={s.closed} reveal="drop">
              <div className="cl-callout" role="presentation">
                <strong>Closed by a legal closure. No one can order from Marsh Lane Hemp.</strong>
                <span>Started by Dana.</span>
                <span className="cl-num">Approvals to reopen: <Roll>{s.approved ? '1 of 2 (Dana)' : '0 of 2'}</Roll></span>
              </div>
              <div className="cl-reopen">
                <Collapse open={!s.approved}>
                  <Button size="medium" variant="secondary" data-target="approve">Approve reopening</Button>
                </Collapse>
                <Collapse open={s.approved} reveal="drop">
                  <span className="cl-note">You approved. A different person must give the second approval.</span>
                </Collapse>
              </div>
            </Collapse>
          </div>

          <div className="cl-card cl-shop">
            <span className="cl-crumb">What shoppers see</span>
            <Collapse open={s.closed} reveal="drop">
              <p className="cl-banner">Ordering is closed right now. You can still browse.</p>
            </Collapse>
            <div className="cl-row">
              <span className="cl-name">Coastal Haze Gummies<small>20 ct</small></span>
              <span className="cl-price">$42.00</span>
            </div>
          </div>
        </div>
      )}
    </Stage>
  )
}
