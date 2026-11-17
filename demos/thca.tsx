import { Collapse, Roll, Stage, type Act } from './parts'
import './thca.css'

// THCA wording: one list of every saved product and label text that still
// says THCA or THC-A. Lab numbers are left alone.
// Beats (plays once in view): the store's settings notice → the cursor opens
// "See where" → the list drops in, and the term is marked in each row in turn.
// Real strings: the notice, the link, the page title and meta, the column
// heads and the field names. Product names and texts are illustrative.

type S = { open: boolean; marked: number }
const initial: S = { open: false, marked: 0 }
const poster: S = { open: true, marked: 3 }

const ROWS = [
  { where: 'Product: Night Shift Vape', field: 'Long description', before: 'Made with live ', term: 'THCA', after: ' resin for a slower…' },
  { where: 'Product: Coastal Haze Gummies', field: 'Tags', before: 'gummies, sleep, ', term: 'THC-A', after: '' },
  { where: 'Label design: Jar label', field: 'Label text', before: 'Contains ', term: 'THCA', after: ' derived from hemp…' },
]

async function script(a: Act<S>) {
  await a.wait(1100)
  await a.click({ at: 'see', x: 0.5, y: 0.6 })
  a.put({ open: true })
  await a.wait(700)
  await a.stagger(ROWS, (_, i) => a.put({ marked: i + 1 }), 380)
  await a.move(a.layout === 'compact' ? { x: 336, y: 450 } : { x: 530, y: 410 })
  await a.wait(2600)
}

export default function Thca() {
  return (
    <Stage<S>
      width={560}
      height={432}
      compact={{ below: 480, width: 358, height: 480 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 530, y: 410 }, compact: { x: 336, y: 450 } } }}
      className="gl gl-thca"
    >
      {(s) => (
        <div className="th-col">
          <div className="th-card">
            <span className="th-crumb">Settings · Name, logo &amp; look</span>
            <p className="th-notice">
              <Roll>{String(ROWS.length)}</Roll> saved texts still say THCA or THC-A.{' '}
              <span className="th-link" data-target="see" data-cursor="pointer">See where</span>
            </p>
            <Collapse open={s.open} reveal="drop">
              <div className="th-list">
                <span className="th-title">THCA wording</span>
                <span className="th-meta">Saved product and label texts that still say THCA or THC-A. Lab numbers and label potency stay as they are.</span>
                <div className="th-table">
                  <span className="th-th">Where</span>
                  <span className="th-th">Field</span>
                  {ROWS.map((r, i) => (
                    <div key={r.where} className="th-row">
                      <span className="th-where">{r.where}</span>
                      <span className="th-field">{r.field}</span>
                      <span className="th-text">
                        {r.before}<mark data-on={s.marked > i || undefined}>{r.term}</mark>{r.after}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      )}
    </Stage>
  )
}
