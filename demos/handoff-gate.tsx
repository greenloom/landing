import { Badge, Bar, Button, Card, Check, Roll, Row, Stage, Text, type Act } from './parts'
import './handoff-gate.css'

// Orders: handoff stays locked until payment, items and the ID check are done.
// Layout: stacked cards (gold: stacked-cards). The handoff card sits whole on
// top; the order's items, the detail it gates, run off the bottom below it.
// Like the gold, the stack stands on the page itself: no plate behind it.
// Beats (plays once in view):
//   1. The handoff card for #1048: items packed, payment and ID still open,
//      Complete handoff locked.
//   2. The cursor takes payment; its line rolls to Paid.
//   3. The cursor checks ID; the button unlocks as the last check lands.
//   4. The cursor completes the handoff; the button confirms on itself and the
//      order's status rolls to Picked up.
// Real strings: the order number, the status, the three checks and their
// states, the button.

type S = { paid: boolean; id: boolean; done: boolean }
const initial: S = { paid: false, id: false, done: false }
const poster: S = { paid: true, id: true, done: true }

async function script(a: Act<S>) {
  await a.wait(1300)
  a.mark('pay')
  await a.click({ at: 'pay-check', x: 0.5, y: 0.5 })
  a.put({ paid: true })
  await a.wait(900)
  a.mark('id')
  await a.click({ at: 'id-check', x: 0.5, y: 0.5 })
  a.put({ id: true })
  await a.wait(1000)
  a.mark('handoff')
  await a.click({ at: 'handoff', x: 0.8, y: 0.6 })
  a.put({ done: true })
  // Ease off the button and stay in view while the status rolls
  await a.move({ at: 'handoff', x: 0.82, y: 1.9 })
  await a.wait(2600)
}

export default function HandoffGate() {
  return (
    <Stage<S>
      width={560}
      height={400}
      compact={{ below: 480, width: 358, height: 400 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 520, y: 380 }, compact: { x: 330, y: 380 } } }}
      className="gl gl-handoff"
    >
      {(s) => {
        const ready = s.paid && s.id
        return (
          <>
            <div className="ho-stack">
            <Card pad="large" gap={0} className="ho-card">
              <div className="ho-head">
                <Text className="ho-title">#1048 · Pickup</Text>
                <Badge tone={s.done ? 'success' : 'neutral'} className="ho-status">
                  <Roll variant="fade">{s.done ? 'Picked up' : 'Ready for pickup'}</Roll>
                </Badge>
              </div>
              <div className="ho-checks">
                <div className="ho-check">
                  <Check on size={16} />
                  <span className="ho-check__name">Items</span>
                  <span className="ho-check__state">2 packed</span>
                </div>
                <div className="ho-check" data-cursor="pointer">
                  <span className="ho-tick" data-target="pay-check"><Check on={s.paid} size={16} /></span>
                  <span className="ho-check__name">Payment</span>
                  <span className="ho-check__state"><Roll variant="fade">{s.paid ? 'Paid $48.00' : 'Due $48.00'}</Roll></span>
                </div>
                <div className="ho-check" data-cursor="pointer">
                  <span className="ho-tick" data-target="id-check"><Check on={s.id} size={16} /></span>
                  <span className="ho-check__name">ID check</span>
                  <span className="ho-check__state"><Roll variant="fade">{s.id ? '21+ checked' : 'Required'}</Roll></span>
                </div>
              </div>
              <Button
                size="large"
                variant={ready ? 'primary' : 'tertiary'}
                className="ho-button"
                data-target="handoff"
                data-locked={!ready || undefined}
                icon={s.done ? <Check on size={14} /> : undefined}
              >
                {s.done ? 'Handed off' : 'Complete handoff'}
              </Button>
            </Card>

            <Card pad="large" gap={0} className="ho-items">
              <span className="ho-items__head">Order</span>
              <Row pad={0} className="ho-item" lead={<Bar w={32} h={32} r={8} tone={2} />} title={<Text className="ho-item__name">Gummies · 10-pack</Text>} subtitle={<Bar w={58} h={5} tone={2} />}>
                <span className="ho-item__qty">× 2</span>
              </Row>
              <Row pad={0} className="ho-item" lead={<Bar w={32} h={32} r={8} tone={2} />} title={<Bar w={84} tone={3} />} subtitle={<Bar w={52} h={5} tone={2} />}>
                <Bar w={22} h={5} tone={2} />
              </Row>
            </Card>
            </div>
          </>
        )
      }}
    </Stage>
  )
}
