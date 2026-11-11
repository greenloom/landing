import { Avatar, Badge, Bar, Collapse, Roll, Row, Stage, Text, Window, type Act } from './parts'
import type { ReactNode } from 'react'
import './loyalty.css'

// Customers: every order lands on a record, and points build with it.
// Layout: fade crop (gold: fade-crop), a window inset on top and both sides,
// dissolving at its foot over filler rows. A system story, no cursor
// (gold: table-edit, where an edit lands and the total it feeds rolls after).
// Beats (plays once in view):
//   1. A club member's record: points, visits, recent orders.
//   2. Today's $48 pickup drops in at the top of the orders, carrying the rest.
//   3. A beat later the points roll 264 → 312 and visits 3 → 4.
// Real strings: the member, Club member, the two stats, Recent orders, the new
// order and its amount and points.

type S = { landed: boolean }
const initial: S = { landed: false }
const poster: S = { landed: true }

async function script(a: Act<S>) {
  await a.wait(1500)
  a.mark('order')
  a.put({ landed: true })
  await a.wait(3600)
}

// At phone width the desktop chrome goes and the record sits on a plain sheet
function Frame({ compact, children }: { compact: boolean; children: ReactNode }) {
  return compact ? <div className="ly-win ly-sheet">{children}</div> : <Window title="Customers" className="ly-win">{children}</Window>
}

const OLDER = [
  { w: 70, sub: 52 },
  { w: 58, sub: 64 },
  { w: 66, sub: 48 },
]

export default function Loyalty() {
  return (
    <Stage<S>
      width={560}
      height={400}
      compact={{ below: 480, width: 358, height: 400 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="gl gl-loyalty"
    >
      {(s, _rect, layout) => (
        <Frame compact={layout === 'compact'}>
          <div className="ly-body">
            <div className="ly-who">
              <Avatar name="Jordan Pierce" size={40} tone="accent" />
              <div className="ly-who__text">
                <Text className="ly-name">Jordan Pierce</Text>
                <Bar w={96} h={5} tone={2} />
              </div>
              <Badge tone="success" className="ly-club">Club member</Badge>
            </div>

            <div className="ly-stats">
              <div className="ly-stat">
                <span className="ly-stat__label">Points</span>
                {/* The total follows its cause: it rolls once the order has landed */}
                <Roll className="ly-stat__value">{s.landed ? '312' : '264'}</Roll>
              </div>
              <div className="ly-stat">
                <span className="ly-stat__label">Visits</span>
                <Roll className="ly-stat__value">{s.landed ? '4' : '3'}</Roll>
              </div>
              <div className="ly-stat">
                <span className="ly-stat__label">Member since</span>
                <span className="ly-stat__value">Mar 2026</span>
              </div>
            </div>

            <div className="ly-orders">
              <span className="ly-orders__head">Recent orders</span>
              <Collapse open={s.landed} reveal="drop">
                <Row
                  pad={0}
                  className="ly-row ly-row--new"
                  title={<Text className="ly-order">Pickup · $48.00</Text>}
                  subtitle={<Text className="ly-when">Today</Text>}
                >
                  <span className="ly-points">+48 pts</span>
                </Row>
              </Collapse>
              {OLDER.map((o, i) => (
                <Row key={i} pad={0} className="ly-row" title={<Bar w={o.w} tone={3} />} subtitle={<Bar w={o.sub} h={5} tone={2} />}>
                  <Bar w={40} h={5} tone={2} />
                </Row>
              ))}
            </div>
          </div>
        </Frame>
      )}
    </Stage>
  )
}
