import { Field, Roll, Stage, type Act } from './parts'
import './price-book.css'

// Price books: one table per category, tiers down the side, sizes across.
// Enter what a gram costs and the profit shows under every price.
// Beats (plays once in view): the table with prices only → the cursor types
// the cost → "Profit" lands under each price, row by row.
// Real strings: Tier, the cost field's label and hint, "Profit". The tier
// names, sizes and prices are sample data; each profit is price − grams × cost.

type S = { cost: string; focused: boolean; shown: number }
const initial: S = { cost: '', focused: false, shown: 0 }
const poster: S = { cost: '4.00', focused: false, shown: 2 }

const SIZES = [{ label: '3.5 g', g: 3.5 }, { label: '7 g', g: 7 }, { label: '14 g', g: 14 }]
const TIERS = [{ name: 'House', prices: [42, 80, 150] }, { name: 'Reserve', prices: [50, 95, 180] }]
const COST = 4

async function script(a: Act<S>) {
  await a.wait(1000)
  await a.click({ at: 'cost', x: 0.6, y: 0.5 })
  a.put({ focused: true })
  await a.type('cost', '4.00', { interval: 130 })
  await a.wait(400)
  a.put({ focused: false, shown: 1 })
  await a.wait(350)
  a.put({ shown: 2 })
  await a.move(a.layout === 'compact' ? { x: 330, y: 330 } : { x: 520, y: 330 })
  await a.wait(2600)
}

export default function PriceBook() {
  return (
    <Stage<S>
      width={560}
      height={360}
      compact={{ below: 480, width: 358, height: 360 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 520, y: 330 }, compact: { x: 330, y: 330 } } }}
      className="gl gl-pb"
    >
      {(s) => (
        <div className="pb-card">
          <div className="pb-head">
            <div>
              <span className="pb-crumb">Price books</span>
              <span className="pb-title">Flower</span>
            </div>
            <Field className="pb-cost" label="Cost per g ($)" value={s.cost} placeholder="0.00" focused={s.focused} box={{ 'data-target': 'cost' }} />
          </div>
          <div className="pb-grid" role="presentation">
            <span className="pb-th">Tier</span>
            {SIZES.map((z) => <span key={z.label} className="pb-th pb-num">{z.label}</span>)}
            {TIERS.map((t, row) => (
              <div key={t.name} className="pb-row">
                <span className="pb-tier">{t.name}</span>
                {t.prices.map((p, i) => (
                  <span key={i} className="pb-cell pb-num">
                    <span className="pb-price">${p}.00</span>
                    <span className="pb-profit" data-on={s.shown > row || undefined}>
                      Profit <Roll>{`$${(p - SIZES[i].g * COST).toFixed(2)}`}</Roll>
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <span className="pb-hint">Used for the profit under each price.</span>
        </div>
      )}
    </Stage>
  )
}
