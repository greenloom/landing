# Rehearsal: Green Loom landing page demos

Three StageShow scenes (workflow, closure, thca), built with the kit (`kit/`) and compiled to
`../site/assets/demos/` with `npm run build`. The hero is plain HTML and CSS.
Every label and status word in a scene is copied from the app
(greenloom/retail-admin); the data is sample data.

## workflow
One card followed through five steps: lab record → listing → checkout age
step → order → handoff. The step list beside the stage is the navigation:
each step plays once and the next begins, picking a step plays from there,
Replay starts over. Under reduced motion each step shows its finished state.
Sources: `coa-sheet.tsx` (Verify COA, "This product can now be published."),
`representations/product/types.ts` (lab and publication words),
`checkout-flow.tsx` (the Age stage text and checkbox), `order-words.tsx`
(order, payment, hold, age, fulfillment words; lanes), `dispatch-lane-card.tsx`
(Accept order, Start packing, Mark ready, Hand off…), `fulfillment-panel.tsx`
(Complete handoff and its confirmation sentence).
Simplified: one card stands in for several screens; "Accept order…" opens a
sheet in the app and is one press here.

## closure
Staff start a legal closure; the shopper banner opens; one approval lands and
the store stays closed until a different person approves. Sources:
`storefront/interruptions-panel.tsx` (trigger, callout, approvals line,
second-approval sentence), `shopper/store-header.tsx` (banner),
`commands/storefront/manage-interruptions.ts` (two different approvers, each
with an authenticator code).

## thca
The settings notice opens the THCA wording list and the term is marked in
each row. Sources: `settings/store/page.tsx` (notice, "See where"),
`settings/thca-worklist/page.tsx` (title, meta, columns),
`manage-store-identity.ts` (field names). Product names and texts are
illustrative.

## Data
The demo product is gummies, not flower: the team's Georgia rule research
(`greenloom/_archive/.../research-synthesis-ga-hemp-rule-read-and-d8449.md`)
records that Georgia prohibits retail sale of hemp flower.

## Checked
In the app's preview browser (Chromium) at 1280 and 375 wide: all three scenes
play, the workflow auto-advances, no console errors, no
horizontal scroll at 375.

## Not checked
- Safari and Firefox; a real touch device.
- An emulated `prefers-reduced-motion` run (the code paths are the kit's
  poster state and a CSS kill switch).
- StageShow's `film.mjs --gate` (the script is not in this repo).
