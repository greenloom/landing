# Rehearsal: Green Loom landing page demos

StageShow scenes: workflow, closure and thca on the main page; validate and coa-clock on the schema page, built with the kit (`kit/`) and compiled to
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

## validate (schema page, site/schema/)
One product document checked against core and the us-ga-hemp profile; the
per-package THC rolls 285 → 320 and GA-CAP-edible fails. The document is the
schema repo's `edible-compliant.json` fixture with one dry-weight THC reading
added (the fixture as published fails GA-THC-TOTAL when its rule function
runs). Every message shown is the rule module's output for this document,
and the document passes the repo's test harness as a valid profile fixture
(checked against the repo's main branch on 2026-11-16).

## coa-clock (schema page)
A lab result tested 2025-12-01 checked by `checkCoaGate` with `now` set to
Nov 30, Dec 1 and Dec 2, 2026: passes, passes, then "tested_at is more than
365 days old".

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
