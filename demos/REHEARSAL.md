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
schema's `us-ga-hemp/valid/edible-compliant.json` fixture as released in
v0.1.1 (identical file), shown abbreviated. Every message shown is the rule
module's output for this document; v0.1.1's harness runs every rule on it.

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

## Guide demos (site/guide/)
Seven scenes on one page, from one engine (`demos/guide/guide.tsx`, scenes as
data in `scenes.ts`): add-product, same-day, handoff, not-home, messages, count,
pause. Copied from: the `workflow` demo above (its card, step list and in-view
stage), not from a stageshow gold; the cards are deliberately one shape so the
page reads as one set. The instructions are the page's own `<ol>` in
`site/guide/index.html`; `mount.tsx` reads it before replacing the slot, so with
JS off the steps still read.
Moments come from the archive's Oil & Eve features research (same-day delivery,
dispatch board, AI product builder), the journey-led IA direction's task list
(accept and prepare an order, pickup vs dispatch checks, COA-first product,
correct stock, pause ordering) and public operator material (ID failures at
handoff, failed deliveries, count variances). No operator interviews exist, so
the page claims nothing about how often tasks happen.
Sources for words (greenLoomv2 `src/components/admin/`): `orders/fulfillment-panel.tsx`
(every dialog title, why-line, field label, FAIL_WORD, Retry, Cancel fulfillment…),
`orders/dispatch-lane-card.tsx` (Accept…, Start packing, Mark ready),
`orders/order-words.tsx` (status and payment words, lanes), `inventory/adjust-sheet.tsx`
(Adjust stock, Change, Reason, Save adjustment, History), `storefront/interruptions-panel.tsx`
(Pause methods, Reason, Notice shoppers see, Resume now, Paused),
`catalog/builder/draft-steps.tsx` and `ai-steps.tsx` (Source, Lab record and lot,
Product, Review; Read label, Read lab), `app/(admin)/admin/support/page.tsx`
(Messages, Waiting, Answered).
Simplified: the Source step's photo and file upload is two rows; the Lab record
step shows values already read; Messages and the pause statuses show their words
in plain rows, not the app's list; "Open the thread" and the Resumed / Delivered
labels stand for a click and a finished state. Order GL-4F2A91C0, Maya Ortiz,
Jordan, Dana and Marsh Lane Hemp are sample data.
Gate (`film.mjs --gate`): fails, as the existing workflow demo above does. The
lines left are the shared card's (`wf-foot` "bottom 8px" fires 6 times on the
workflow demo too; the card sits inside the stage with uneven gutters), the
Swap / Roll "vanishes with no exit" and "hard edge" lines, and the whole-stage
jumps when a step restarts. Fixed from the first run: field labels aligned with
their values, one-line field rows (not 68px "fat" rows), the cursor aimed off the
button label, values that spilled their slot at 390 wide.
Not checked: Safari and Firefox, a real touch device, a screen reader on the
step list, reduced motion beyond the poster frame.
