import { Bar, Stage, type Act } from './parts'
import { QR_ROWS } from './qr'
import './label.css'

// Compliance labels, as an object rather than a screen (bento.md, Kinds of
// tile), flat and frontal (framing.md, rule 9; paper per gold tilted-stack). One
// label per line item: an order of two lines prints two labels, each feeding
// down from the printer above the tile edge, the second a beat after the first.
// At phone width the tile holds one.
// Real strings: each product, its batch line, Scan for lab report, and the
// warning. The QR is a real code for a sample URL; the warning carries common
// adult-use wording only, not invented statute.

type S = { printed: number }
const initial: S = { printed: 0 }
const poster: S = { printed: 2 }

async function script(a: Act<S>) {
  await a.wait(700)
  a.mark('print')
  a.put({ printed: 1 })
  await a.wait(650)
  a.put({ printed: 2 })
  await a.wait(2600)
}

function Qr({ size }: { size: number }) {
  const n = QR_ROWS.length
  return (
    <svg className="lb-qr" width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} shapeRendering="crispEdges" aria-hidden>
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      {QR_ROWS.flatMap((row, y) => [...row].map((bit, x) => (bit === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#141414" /> : null)))}
    </svg>
  )
}

const LINES = [
  { name: 'Gummies · 10-pack', batch: 'Batch GL-1048 · Tested Oct 3' },
  { name: 'Tincture · 30 ml', batch: 'Batch GL-0977 · Tested Sep 18' },
]

export default function Label() {
  return (
    <Stage<S>
      width={688}
      height={280}
      compact={{ below: 600, width: 350, height: 300 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="gl gl-label"
    >
      {(s) => (
        <div className="lb-row">
          {LINES.map((line, i) => (
            <div key={line.name} className={`lb-label lb-label--${i}`} data-printed={s.printed > i || undefined}>
              <span className="lb-name">{line.name}</span>
              <span className="lb-batch">{line.batch}</span>
              <div className="lb-scan">
                <Qr size={76} />
                <span className="lb-scan__text">Scan for lab report</span>
              </div>
              <span className="lb-warning">Warning</span>
              <span className="lb-warning__text">For adults 21 and over. Keep out of reach of children.</span>
              <Bar w={120} h={5} tone={3} />
            </div>
          ))}
        </div>
      )}
    </Stage>
  )
}
