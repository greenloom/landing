import { Badge, Bar, Button, Check, Collapse, Roll, Row, Stage, Text, Window, type Act } from './parts'
import type { ReactNode } from 'react'
import { Glyph } from './glyph'
import './coa-block.css'

// Catalog: an expired lab result blocks the listing, not the product.
// Layout: corner bleed (framing.md): inset top and left, running off the right
// and bottom. Neighbouring products stay Published so the blocked one reads.
// Beats (plays once in view):
//   1. The calm catalog: the gummies are Published, their lab result expires Oct 12.
//   2. The day turns over (Oct 12 → Oct 13): the cause, in the header.
//   3. The listing drops to Draft on its own, and says why under the row.
//   4. The cursor links the new report; the date rolls forward and the listing
//      returns to Published. The product itself never changed.
// Real strings: Products, the date, the product, its expiry, the status,
// the reason, the button. Everything else is filler.

type S = { day: 12 | 13; expired: boolean; linked: boolean }
const initial: S = { day: 12, expired: false, linked: false }
// The poster is the blocked state: it tells the story on its own.
const poster: S = { day: 13, expired: true, linked: false }

async function script(a: Act<S>) {
  await a.wait(1400)
  a.mark('day')
  a.put({ day: 13 })
  await a.wait(700)
  a.mark('block')
  a.put({ expired: true })
  await a.wait(1800)
  a.mark('link')
  await a.click({ at: 'link', x: 0.8, y: 0.6 })
  // The button confirms on itself, then the listing follows its cause
  a.put({ linked: true })
  await a.wait(700)
  a.put({ expired: false })
  // Park on the window's empty margin, clear of every row
  await a.move(a.layout === 'compact' ? { x: 330, y: 340 } : { x: 530, y: 330 })
  await a.wait(2600)
}

function Catalog({ children }: { children: ReactNode }) {
  return <Window title="Catalog" className="coa-win">{children}</Window>
}
function Sheet({ children }: { children: ReactNode }) {
  return <div className="coa-win coa-sheet">{children}</div>
}

export default function CoaBlock() {
  return (
    <Stage<S>
      width={560}
      height={400}
      compact={{ below: 480, width: 358, height: 360 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 520, y: 372 }, compact: { x: 330, y: 336 } } }}
      className="gl gl-coa"
    >
      {(s, _rect, layout) => {
        const blocked = s.expired && !s.linked
        // At phone width the desktop chrome goes and the same list sits on a
        // plain sheet (craft.md, Density: drop the desktop anatomy)
        const Frame = layout === 'compact' ? Sheet : Catalog
        return (
          <Frame>
            <div className="coa-body">
              <div className="coa-head">
                <Text className="coa-title">Products</Text>
                <span className="coa-today">
                  <Glyph name="calendar" size={14} />
                  <span>Oct <Roll>{String(s.day)}</Roll></span>
                </span>
              </div>

              <Row className="coa-row" pad={0} lead={<span className="coa-thumb coa-thumb--quiet"><Glyph name="flask" size={16} /></span>} title={<Text className="coa-name">Tincture · 30 ml</Text>} subtitle={<span className="coa-expiry">COA expires Mar 4, 2027</span>}>
                <Badge tone="success" className="coa-status">Published</Badge>
              </Row>

              <div className="coa-focus" data-blocked={blocked || undefined}>
                <Row
                  className="coa-row coa-row--focus"
                  pad={0}
                  lead={<span className="coa-thumb"><Glyph name="leaf" size={16} /></span>}
                  title={<Text className="coa-name">Gummies · 10-pack</Text>}
                  subtitle={
                    <span className="coa-expiry" data-expired={blocked || undefined}>
                      COA expires <Roll>{s.linked ? 'Oct 3, 2027' : 'Oct 12'}</Roll>
                    </span>
                  }
                >
                  <Badge tone={blocked ? 'warning' : 'success'} className="coa-status">
                    <Roll variant="fade">{blocked ? 'Draft' : 'Published'}</Roll>
                  </Badge>
                </Row>
                <Collapse open={s.expired} reveal="drop">
                  <div className="coa-reason">
                    <span className="coa-reason__text">
                      <Glyph name="alert" size={14} />
                      Lab result expired
                    </span>
                    <Button size="small" data-target="link" data-cursor="pointer" icon={s.linked ? <Check on size={12} /> : undefined}>
                      {s.linked ? 'Linked' : 'Link new COA'}
                    </Button>
                  </div>
                </Collapse>
              </div>

              <Row className="coa-row" pad={0} lead={<span className="coa-thumb coa-thumb--quiet"><Glyph name="package" size={16} /></span>} title={<Text className="coa-name">Pre-roll · 5-pack</Text>} subtitle={<span className="coa-expiry">COA expires Jan 20, 2027</span>}>
                <Badge tone="success" className="coa-status">Published</Badge>
              </Row>
              <Row className="coa-row" pad={0} lead={<Bar w={36} h={36} r={9} tone={2} />} title={<Bar w={84} tone={3} />} subtitle={<Bar w={50} h={5} tone={2} />}>
                <Bar w={46} h={18} r={9} tone={2} />
              </Row>
            </div>
          </Frame>
        )
      }}
    </Stage>
  )
}
