// The kit parts these demos use, imported from their own files. The kit's
// index re-exports every part, and each part imports its CSS, so importing the
// index would pull the whole kit (and all its styles) into the page's bundle.
export { Stage } from './kit/stage'
export type { Act } from './kit/act'
export { Button } from './kit/controls/Button'
export { Collapse } from './kit/motion/Collapse'
export { Roll } from './kit/motion/Roll'
export { Swap } from './kit/motion/Swap'
