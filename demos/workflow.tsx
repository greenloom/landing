import { useMemo, useState, type ReactNode } from 'react'
import { Button, Collapse, Roll, Stage, Swap, type Act } from './parts'
import './workflow.css'

// The main story: one batch of product followed from its lab record to the
// counter. One card stays on stage the whole way and changes form at each
// step, so the facts recorded upstream are visibly still there downstream.
// Every word inside the card is the app's own (labels, status words, the
// checkout and handoff sentences); the data is sample data.
//
// Control: the step list beside the stage is the navigation. Each step plays
// once, then the next begins; picking a step plays from there; Replay starts
// over. Under reduced motion each step shows its finished state.

type S = { beat: number }
type Tone = 'neutral' | 'info' | 'pending' | 'success'

const STEPS = [
  { name: 'Check the lab report', text: 'Enter the batch’s lab report once and check it. Its dates decide whether the product can be sold.', beats: 1 },
  { name: 'Publish only what’s tested', text: 'A product reaches the menu only with a checked, in-date lab record, and shoppers see the same results.', beats: 2 },
  { name: 'Confirm age at checkout', text: 'Shoppers confirm they’re 21 or older and are told to bring ID. Nothing about their ID is collected online.', beats: 3 },
  { name: 'Keep the order’s facts together', text: 'Payment, held stock and the age check travel with the order while staff accept it and pack it.', beats: 3 },
  { name: 'Check ID at the counter', text: 'Handoff completes only after staff confirm the ID check and payment. The result and their name are kept, never the ID.', beats: 3 },
] as const

const LANES = ['On hold', 'In queue', 'Packing', 'Dispatched']

// What each step's script does: press the named targets in order, one beat each.
const PRESSES: string[][] = [['act'], ['act'], ['box', 'act', 'act'], ['act', 'act', 'act'], ['act', 'box', 'act']]

function scriptFor(step: number, onEnd: () => void) {
  return async (a: Act<S>) => {
    await a.wait(1100)
    let beat = 0
    for (const target of PRESSES[step]) {
      a.mark(`s${step}-b${beat}`)
      await a.click({ at: target, x: target === 'box' ? 0.5 : 0.75, y: 0.6 })
      a.put({ beat: ++beat })
      await a.wait(1000)
    }
    // Publishing has one more consequence: the listing appears on the menu
    if (step === 1) a.put({ beat: 2 })
    await a.move(a.layout === 'compact' ? { x: 336, y: 444 } : { x: 530, y: 424 })
    await a.wait(2200)
    onEnd()
  }
}

function Tag({ tone = 'neutral', children }: { tone?: Tone; children: string }) {
  return <span className="wf-tag" data-tone={tone}><Roll variant="fade">{children}</Roll></span>
}

function Fact({ label, children, note }: { label: string; children: ReactNode; note?: string }) {
  return (
    <div className="wf-fact">
      <span className="wf-fact__label">{label}</span>
      <span className="wf-fact__value">{children}{note && <span className="wf-fact__note">{note}</span>}</span>
    </div>
  )
}

function Tick({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="wf-tick" data-cursor="pointer">
      <span className="wf-box" data-target="box" data-on={on || undefined}>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden><path d="M2.5 6.5l2.5 2.5 4.5-5.5" /></svg>
      </span>
      <span>{children}</span>
    </div>
  )
}

type View = { crumb: string; title: string; tag: { word: string; tone: Tone }; body: ReactNode; bodyKey: string; act: string; locked?: boolean; note?: string; lane?: number }

function view(step: number, b: number): View {
  const order = 'GL-4F2A91C0'
  if (step === 0)
    return {
      crumb: 'Lab records', title: 'Batch CH-0611', bodyKey: '0',
      tag: b ? { word: 'Lab record checked', tone: 'success' } : { word: 'Lab record unchecked', tone: 'pending' },
      body: (
        <>
          <Fact label="Lab">Tidewater Labs</Fact>
          <Fact label="Tested on">Jun 1, 2026</Fact>
          <Fact label="Valid until">Jun 1, 2027</Fact>
          <Fact label="THC · CBD">0.28% · 1.1%</Fact>
          <Fact label="Lot">LOT-0611 · 24 units</Fact>
        </>
      ),
      act: b ? 'Verified' : 'Verify COA',
      note: b ? 'This product can now be published.' : undefined,
    }
  if (step === 1)
    return {
      crumb: 'Catalog', title: 'Coastal Haze Gummies', bodyKey: '1',
      tag: b ? { word: 'Published', tone: 'success' } : { word: 'Draft', tone: 'neutral' },
      body: (
        <>
          <Fact label="Option">20 ct</Fact>
          <Fact label="Price">$42.00</Fact>
          <Fact label="Available">24</Fact>
          <Fact label="Lab record"><span className="wf-tag" data-tone="success">Lab record checked</span></Fact>
        </>
      ),
      act: b ? 'Published' : 'Publish',
    }
  if (step === 2) {
    if (b < 2)
      return {
        crumb: 'Marsh Lane Hemp · Checkout', title: 'Age', bodyKey: '2a', tag: { word: 'Step 2 of 4', tone: 'neutral' },
        body: (
          <>
            <p className="wf-say">This store sells only to people 21 or older. You’ll also show a government photo ID when you pick up or receive your order. We don’t ask for your ID or a photo here.</p>
            <Tick on={b > 0}>I confirm I am 21 or older.</Tick>
          </>
        ),
        act: 'Continue', locked: b === 0,
      }
    return {
      crumb: 'Marsh Lane Hemp · Checkout', bodyKey: '2b',
      title: b > 2 ? 'Order placed' : 'Final review',
      tag: b > 2 ? { word: order, tone: 'success' } : { word: 'Step 4 of 4', tone: 'neutral' },
      body: (
        <>
          <Fact label="1 × Coastal Haze Gummies · 20 ct">$42.00</Fact>
          <Fact label="Pickup">Free</Fact>
          <Fact label="Payment">Due at pickup</Fact>
        </>
      ),
      act: b > 2 ? 'Placed' : 'Place order',
    }
  }
  if (step === 3)
    return {
      crumb: 'Orders', title: `${order} · Pickup`, bodyKey: '3', lane: [0, 1, 2, 2][b],
      tag: b ? { word: 'Accepted', tone: 'success' } : { word: 'Needs review', tone: 'info' },
      body: (
        <>
          <Fact label="Payment"><Tag tone="pending">Due at pickup</Tag></Fact>
          <Fact label="Stock hold" note={b ? undefined : 'Hold expires in 23 h 52 min'}><Tag tone={b ? 'success' : 'info'}>{b ? 'Stock taken' : 'Held'}</Tag></Fact>
          <Fact label="Age check"><Tag tone="success">Age confirmed</Tag></Fact>
          <Fact label="Fulfillment"><Tag tone={b === 3 ? 'success' : b === 2 ? 'info' : 'neutral'}>{['Scheduled', 'Scheduled', 'Packing', 'Ready'][b]}</Tag></Fact>
        </>
      ),
      act: ['Accept order', 'Start packing', 'Mark ready', 'Marked ready'][b],
    }
  const done = b === 3
  return {
    crumb: 'Orders · Hand off at the counter', title: `${order} · Pickup`, bodyKey: '4',
    tag: done ? { word: 'Done', tone: 'neutral' } : { word: 'Accepted', tone: 'success' },
    body: (
      <>
        <Fact label="Payment"><Tag tone={done ? 'success' : 'pending'}>{done ? 'Paid' : 'Due at pickup'}</Tag></Fact>
        <Fact label="Age check" note={done ? 'ID at handoff by Dana' : undefined}><Tag tone="success">Age confirmed</Tag></Fact>
        <Fact label="Fulfillment"><Tag tone="success">{done ? 'Done' : 'Ready'}</Tag></Fact>
        <Collapse open={b > 0 && !done}>
          <Tick on={b > 1}>I collected $42.00 and checked the customer’s government ID and they are of legal age.</Tick>
        </Collapse>
      </>
    ),
    act: ['Hand off…', 'Complete handoff', 'Complete handoff', 'Handed off'][b],
    locked: b === 1,
  }
}

export default function Workflow() {
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  const [ended, setEnded] = useState(false)
  const go = (i: number) => { setStep(i); setRun((r) => r + 1); setEnded(false) }
  // A new script identity restarts the stage from this step's first frame
  const script = useMemo(
    () => scriptFor(step, () => (step < STEPS.length - 1 ? go(step + 1) : setEnded(true))),
    [step, run], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const initial = useMemo<S>(() => ({ beat: 0 }), [step, run]) // eslint-disable-line react-hooks/exhaustive-deps
  const poster = useMemo<S>(() => ({ beat: STEPS[step].beats }), [step])

  return (
    <div className="wf">
      <div className="wf-nav">
        <ol className="wf-steps">
          {STEPS.map((s, i) => (
            <li key={s.name}>
              <button type="button" className="wf-step" aria-current={i === step ? 'step' : undefined} data-past={i < step || undefined} onClick={() => go(i)}>
                <span className="wf-step__n" aria-hidden>{i + 1}</span>
                <span className="wf-step__text">
                  <span className="wf-step__name">{s.name}</span>
                  <span className="wf-step__desc">{s.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {/* Phone: the list is a row of numbers, so the current step is spelled out here */}
        <p className="wf-now" aria-hidden>
          <strong>{STEPS[step].name}.</strong> {STEPS[step].text}
        </p>
        <button type="button" className="wf-replay" onClick={() => go(0)} data-show={ended || undefined}>Replay from the start</button>
      </div>

      <div className="wf-stage" role="img" aria-label={`Step ${step + 1} of 5, ${STEPS[step].name}: ${STEPS[step].text}`}>
        <Stage<S>
          width={560}
          height={452}
          compact={{ below: 480, width: 358, height: 470 }}
          initial={initial}
          poster={poster}
          script={script}
          play="once"
          cursor={{ at: { wide: { x: 530, y: 424 }, compact: { x: 336, y: 444 } } }}
          className="gl gl-wf"
        >
          {(s) => {
            const v = view(step, Math.min(s.beat, STEPS[step].beats))
            return (
              <div className="wf-col">
                <div className="wf-lanes" data-show={v.lane !== undefined || undefined}>
                  {LANES.map((l, i) => <span key={l} data-on={i === v.lane || undefined}>{l}</span>)}
                </div>
                <div className="wf-card">
                  <Swap id={v.crumb} className="wf-crumb">{v.crumb}</Swap>
                  <div className="wf-head">
                    <Swap id={v.title} className="wf-title">{v.title}</Swap>
                    <span className="wf-tag" data-tone={v.tag.tone}><Roll variant="fade">{v.tag.word}</Roll></span>
                  </div>
                  <Swap id={v.bodyKey} className="wf-body"><div className="wf-body__in">{v.body}</div></Swap>
                  <div className="wf-foot">
                    <span className="wf-note"><Roll variant="fade">{v.note ?? ''}</Roll></span>
                    <Button size="large" variant={v.locked ? 'tertiary' : 'primary'} data-target="act" data-locked={v.locked || undefined}>{v.act}</Button>
                  </div>
                </div>
                {/* The listing's other form: what a shopper sees once it is published */}
                <Collapse open={step === 1 && s.beat >= 2} reveal="drop">
                  <div className="wf-menu">
                    <span className="wf-crumb">Product page</span>
                    <div className="wf-menu__row">
                      <span className="wf-menu__name">Coastal Haze Gummies<small>20 ct</small></span>
                      <span className="wf-menu__price">$42.00</span>
                    </div>
                    <span className="wf-menu__lab">Lab results · Batch CH-0611 · THC 0.28% · CBD 1.1% · Valid until Jun 1, 2027</span>
                  </div>
                </Collapse>
              </div>
            )
          }}
        </Stage>
      </div>
    </div>
  )
}
