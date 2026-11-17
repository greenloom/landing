import { useMemo, useState } from 'react'
import { Button, Roll, Stage, Swap, type Act } from '../parts'
import type { Beat, Row, Scene } from './scenes'
import './guide.css'

// One engine for every guide demo: the step list beside a Stage (the navigation,
// as on the landing page's workflow). A scene is data: for each step, the
// screens the card passes through. The script presses `beat.press` (the
// button by default) to move from one screen to the next, so every beat is a
// real press. The instructions themselves are the page's own <ol>, which
// mount.tsx reads before it replaces the slot, so the text exists once.

type S = { beat: number }
export type StepText = { name: string; text: string }

function scriptFor(beats: Beat[], step: number, onEnd: () => void) {
  return async (a: Act<S>) => {
    await a.wait(1000)
    for (let i = 0; i < beats.length - 1; i++) {
      const target = beats[i].press ?? 'act'
      a.mark(`s${step}-b${i}`)
      await a.click({ at: target, x: target === 'act' ? 0.9 : 0.5, y: target === 'act' ? 0.85 : 0.6 })
      a.put({ beat: i + 1 })
      await a.wait(1000)
    }
    await a.move(a.layout === 'compact' ? { x: 336, y: 444 } : { x: 530, y: 424 })
    await a.wait(2000)
    onEnd()
  }
}

function Line({ r }: { r: Row }) {
  if (r.k === 'say') return <p className="wf-say">{r.text}</p>
  if (r.k === 'tick')
    return (
      <div className="wf-tick" data-cursor="pointer">
        <span className="wf-box" data-target="tick" data-on={r.on || undefined}>
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden><path d="M2.5 6.5l2.5 2.5 4.5-5.5" /></svg>
        </span>
        <span>{r.text}</span>
      </div>
    )
  if (r.k === 'field')
    return (
      <div className="gd-field" data-cursor="text">
        <span className="gd-field__label">{r.label}</span>
        <span className="gd-input" data-target={r.hot ? 'field' : undefined} data-empty={r.value ? undefined : ''}>
          <Roll variant="fade">{r.value || ' '}</Roll>
        </span>
      </div>
    )
  return (
    <div className="wf-fact">
      <span className="wf-fact__label">{r.label}</span>
      <span className="wf-fact__value">
        {r.tone ? <span className="wf-tag" data-tone={r.tone}><Roll variant="fade">{r.value}</Roll></span> : <Roll variant="fade">{r.value}</Roll>}
        {r.note && <span className="wf-fact__note">{r.note}</span>}
      </span>
    </div>
  )
}

export default function Guide({ scene, steps, label }: { scene: Scene; steps: StepText[]; label: string }) {
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  const [ended, setEnded] = useState(false)
  const go = (i: number) => { setStep(i); setRun((r) => r + 1); setEnded(false) }
  const beats = scene.steps[step]
  const script = useMemo(
    () => scriptFor(beats, step, () => (step < scene.steps.length - 1 ? go(step + 1) : setEnded(true))),
    [step, run], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const initial = useMemo<S>(() => ({ beat: 0 }), [step, run]) // eslint-disable-line react-hooks/exhaustive-deps
  const poster = useMemo<S>(() => ({ beat: beats.length - 1 }), [beats])
  const cur = steps[step] ?? { name: '', text: '' }

  return (
    <div className="wf">
      <div className="wf-nav">
        <ol className="wf-steps">
          {steps.map((s, i) => (
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
        <p className="wf-now" aria-hidden><strong>{cur.name}.</strong> {cur.text}</p>
        <button type="button" className="wf-replay" onClick={() => go(0)} data-show={ended || undefined}>Replay from the start</button>
      </div>

      <div className="wf-stage" role="img" aria-label={`${label}. Step ${step + 1} of ${steps.length}, ${cur.name}: ${cur.text}`}>
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
            const v = beats[Math.min(s.beat, beats.length - 1)]
            return (
              <div className="wf-col">
                <div className="wf-lanes" data-show={v.lane !== undefined || undefined}>
                  {['On hold', 'In queue', 'Packing', 'Dispatched'].map((l, i) => <span key={l} data-on={i === v.lane || undefined}>{l}</span>)}
                </div>
                <div className="wf-card">
                  <Swap id={v.crumb} className="wf-crumb">{v.crumb}</Swap>
                  <div className="wf-head">
                    <Swap id={v.title} className="wf-title">{v.title}</Swap>
                    {v.tag && <span className="wf-tag" data-tone={v.tag.tone}><Roll variant="fade">{v.tag.word}</Roll></span>}
                  </div>
                  <Swap id={v.crumb + v.rows.map((r) => r.k).join('')} className="wf-body"><div className="wf-body__in">{v.rows.map((r, i) => <Line key={i} r={r} />)}</div></Swap>
                  <div className="wf-foot">
                    <span className="wf-note"><Roll variant="fade">{v.note ?? ''}</Roll></span>
                    <Button size="large" variant={v.locked ? 'tertiary' : 'primary'} data-target="act" data-locked={v.locked || undefined}>{v.act}</Button>
                  </div>
                </div>
              </div>
            )
          }}
        </Stage>
      </div>
    </div>
  )
}
