import type { CSSProperties } from 'react'
import { CalendarDays, FlaskConical, IdCard, Leaf, Package, Printer, ReceiptText, ScanLine, ShieldCheck, Star, Store, TriangleAlert, type LucideIcon } from 'lucide-react'

// One icon family for every demo: lucide, the same set the kit's Icon draws
// from, at one stroke weight (craft.md, Icons and logos). The kit's Icon only
// names a handful of glyphs; these are the extra ones the stories need.
const GLYPHS = {
  alert: TriangleAlert,
  calendar: CalendarDays,
  flask: FlaskConical,
  id: IdCard,
  package: Package,
  receipt: ReceiptText,
  store: Store,
  leaf: Leaf,
  printer: Printer,
  scan: ScanLine,
  shield: ShieldCheck,
  star: Star,
} satisfies Record<string, LucideIcon>

export type GlyphName = keyof typeof GLYPHS

export function Glyph({ name, size = 16, className, style }: { name: GlyphName; size?: number; className?: string; style?: CSSProperties }) {
  const G = GLYPHS[name]
  return <G size={size} strokeWidth={1.75} className={className} style={{ flex: 'none', ...style }} aria-hidden />
}
