import { Bar, Button, Check, Collapse, Field, Roll, Row, Segmented, Stage, States, Text, type Act } from './parts'
import './stock-reason.css'

// Inventory: every stock change carries a reason. One component, not a window
// (bento.md, rule 3), set straight on the tile at its copy gutter and running
// off the bottom (gold: form-error, where the mistake is caught on the field
// that caused it and cleared by fixing it).
// Beats (plays once in view):
//   1. −2 is typed into Change.
//   2. Save is pressed with no reason: the reasons ring in the warning tone and
//      the lane under the form says why. Nothing is saved.
//   3. The cursor picks Damaged; the warning clears.
//   4. Save: the entry drops into the log and On hand rolls 10 → 8.
// Real strings: Change, −2, Reason and its options, the lane, Save, On hand,
// the log entry.

type S = { change: string; focused: boolean; reason: number | null; missing: boolean; saved: boolean }
const initial: S = { change: '', focused: false, reason: null, missing: false, saved: false }
const poster: S = { change: '−2', focused: false, reason: 0, missing: false, saved: true }

const REASONS = ['Damaged', 'Recount', 'Recall']

async function script(a: Act<S>) {
  await a.wait(800)
  a.mark('type')
  await a.click({ at: 'change', x: 0.7, y: 0.5 })
  a.put({ focused: true })
  await a.type('change', '−2', { interval: 120 })
  await a.wait(500)
  a.mark('missing')
  await a.click({ at: 'save', x: 0.7, y: 0.6 })
  a.put({ missing: true, focused: false })
  await a.wait(1500)
  a.mark('reason')
  await a.click({ at: 'damaged', x: 0.5, y: 0.75 })
  a.put({ reason: 0, missing: false })
  await a.wait(800)
  a.mark('save')
  await a.click({ at: 'save', x: 0.7, y: 0.6 })
  a.put({ saved: true })
  // Rest on the empty band between the reason and Save, off every word
  await a.move({ at: 'save', x: -1.4, y: 0.5 })
  await a.wait(2600)
}

export default function StockReason() {
  return (
    <Stage<S>
      width={688}
      height={280}
      compact={{ below: 600, width: 350, height: 340 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 650, y: 250 }, compact: { x: 320, y: 310 } } }}
      className="gl gl-stock"
    >
      {(s) => {
        return (
          <div className="sr-card">
            <div className="sr-head">
              <Text className="sr-title">Gummies · 10-pack</Text>
              <span className="sr-onhand">
                On hand <Roll className="sr-onhand__n">{s.saved ? '8' : '10'}</Roll>
              </span>
            </div>
            <div className="sr-form">
              <span className="sr-label">Change</span>
              <span className="sr-label">Reason</span>
              <span />
              <Field value={s.change} placeholder="0" focused={s.focused} className="sr-field" box={{ 'data-target': 'change' }} />
              <Segmented items={REASONS} value={s.reason ?? 0} targets={['damaged']} cursor="pointer" className="sr-seg" data-empty={s.reason === null || undefined} data-missing={s.missing || undefined} />
              <Button size="large" variant="primary" className="sr-save" data-target="save" icon={s.saved ? <Check on size={14} /> : undefined}>
                {s.saved ? 'Saved' : 'Save'}
              </Button>
            </div>
            {/* One line, always there, so the warning never moves the log */}
            <div className="sr-lane" data-tone={s.missing ? 'warn' : undefined}>
              <States value={s.missing ? 'missing' : 'hint'} align="start" states={{ hint: 'Every change is kept in the stock log', missing: 'Pick a reason to save this change' }} />
            </div>
            <div className="sr-log">
              <span className="sr-log__head">Stock log</span>
              <Collapse open={s.saved} reveal="drop">
                <Row pad={0} className="sr-entry" title={<Text className="sr-entry__what">−2 · Damaged</Text>}>
                  <span className="sr-entry__when">Just now</span>
                </Row>
              </Collapse>
              <Row pad={0} className="sr-entry" title={<Bar w={84} tone={3} />}>
                <Bar w={48} h={5} tone={2} />
              </Row>
              <Row pad={0} className="sr-entry" title={<Bar w={70} tone={3} />}>
                <Bar w={56} h={5} tone={2} />
              </Row>
            </div>
          </div>
        )
      }}
    </Stage>
  )
}
