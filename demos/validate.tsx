import { Roll, Stage, type Act } from './parts'
import './validate.css'

// Schema page hero: one product document, checked against core and then the
// Georgia profile's five rules. One number changes and one rule catches it.
// Beats (plays once in view, no cursor):
//   1. The run: core is valid, then the five rule rows land in turn, all pass.
//   2. The per-package THC rolls 285 → 320 in the document.
//   3. The run again: core is still valid; GA-CAP-edible fails with its message.
// Real strings: the document (a copy of the repo's edible fixture with a
// dry-weight THC reading added), the rule IDs and every message, which are the
// rule module's own output for this document.

type S = { shown: number; edited: boolean }
const initial: S = { shown: 0, edited: false }
const poster: S = { shown: 5, edited: true }

const RULES = [
  { id: 'GA-FORM-BAN', ok: 'form is GA-retail-eligible' },
  { id: 'GA-REG-CLASS', ok: 'regulatory_class is GA-retail-eligible' },
  { id: 'GA-CAP-edible', ok: 'within cap', fail: 'per-package THC 320mg > 300mg cap' },
  { id: 'GA-THC-TOTAL', ok: 'total THC = (0 × 0.877) + 0.21 = 0.2100% <= 0.3%' },
  { id: 'GA-COA-GATE', ok: 'COA gate satisfied' },
]

async function script(a: Act<S>) {
  await a.wait(900)
  for (let i = 1; i <= RULES.length; i++) {
    a.put({ shown: i })
    await a.wait(260)
  }
  await a.wait(1800)
  a.mark('edit')
  a.put({ edited: true })
  await a.wait(1100)
  a.mark('rerun')
  a.put({ shown: 0 })
  await a.wait(500)
  for (let i = 1; i <= RULES.length; i++) {
    a.put({ shown: i })
    await a.wait(260)
  }
  await a.wait(3000)
}

const K = ({ children }: { children: string }) => <span className="va-k">"{children}"</span>
const V = ({ children }: { children: string }) => <span className="va-s">"{children}"</span>

function Mark({ ok }: { ok: boolean | null }) {
  return (
    <span className="va-mark" data-state={ok === null ? 'wait' : ok ? 'ok' : 'fail'} aria-hidden>
      <svg viewBox="0 0 12 12" width="12" height="12">
        {ok === false ? <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /> : <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />}
      </svg>
    </span>
  )
}

export default function Validate() {
  return (
    <Stage<S>
      width={1040}
      height={440}
      compact={{ below: 760, width: 358, height: 800 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="gl gl-va"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        const done = s.shown === RULES.length
        const failed = s.edited
        return (
          <div className="va-wrap">
            <div className="va-doc">
              <span className="va-file">product.json</span>
              <pre className="va-code">
{'{\n'}
{'  '}<K>name</K>: {'{ '}<K>en</K>: <V>Peachtree Calm Gummies</V>{' },\n'}
{'  '}<K>product_form</K>: <V>edible</V>{',\n'}
{'  '}<K>regulatory_class</K>: <V>hemp_derived</V>{',\n'}
{'  '}<K>packages</K>{': [{\n'}
{'    '}<K>net_contents</K>: {'{ '}<K>value</K>: <span className="va-n">30</span>{compact ? ', … },\n' : <>, <K>unit</K>: <V>count</V>{' },\n'}</>}
{'    '}<K>lab_result</K>{': {\n'}
{'      '}<K>tested_at</K>: <V>{compact ? '2026-04-01' : '2026-04-01T00:00:00Z'}</V>{',\n'}
{'      '}<K>cannabinoids</K>{': [\n'}
{'        '}{'{ '}<K>code</K>: <V>THC</V>, <K>value</K>: <span className="va-n">0.21</span>{compact ? ', …' : <>, <K>basis</K>: <V>percent_dry_weight</V></>}{' },\n'}
{'        '}{'{ '}<K>code</K>: <V>THC</V>, <K>value</K>: <span className="va-n">9.5</span>{compact ? ', …' : <>, <K>basis</K>: <V>per_serving</V></>}{' },\n'}
{'        '}{'{ '}<K>code</K>: <V>THC</V>, <K>value</K>: <span className="va-n va-edit" data-on={s.edited || undefined}><Roll>{s.edited ? '320' : '285'}</Roll></span>{compact ? ', …' : <>, <K>basis</K>: <V>per_package</V></>}{' },\n'}
{'        '}<span className="va-dim">{'… CBD, CBDA, CBG, CBGA, CBN, HHC\n'}</span>
{'      ]\n'}
{'    }\n'}
{'  }]\n'}
{'}'}
              </pre>
            </div>

            <div className="va-out">
              <div className="va-row va-core">
                <span className="va-name">Core v0.1</span>
                <span className="va-tag" data-tone={s.shown > 0 ? 'ok' : 'wait'}><Roll variant="fade">{s.shown > 0 ? 'Valid' : 'Checking'}</Roll></span>
              </div>
              <div className="va-profile">
                <div className="va-row">
                  <span className="va-name">Profile us-ga-hemp</span>
                  <span className="va-tag" data-tone={!done ? 'wait' : failed ? 'fail' : 'ok'}>
                    <Roll variant="fade">{!done ? 'Checking' : failed ? 'Not valid' : 'Valid'}</Roll>
                  </span>
                </div>
                <ul className="va-rules">
                  {RULES.map((r, i) => {
                    const ran = s.shown > i
                    const ok = !(failed && r.fail)
                    return (
                      <li key={r.id} className="va-rule" data-ran={ran || undefined} data-fail={(ran && !ok) || undefined}>
                        <Mark ok={ran ? ok : null} />
                        <span className="va-id">{r.id}</span>
                        <span className="va-msg">{ran ? (ok ? r.ok : r.fail) : ' '}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )
      }}
    </Stage>
  )
}
