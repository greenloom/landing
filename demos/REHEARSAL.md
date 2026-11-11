# Rehearsal: Green Loom landing page demos

Six StageShow scenes, built with the skill's kit (`kit/`, copied from the
skill) and compiled to `../assets/demos/` with `pnpm landing:demos`. Each plays
once as it scrolls into view and shows its poster under reduced motion.

Filmed on the real page (`landingpage/index.html` served locally) with
`scripts/film.mjs --gate`, at 1280 and at 390, plus `--states` sheets and a
`--reduced` still of the whole page. Chrome only.

## flow
Gold: payout-flow (cursorless, slow overlapping arrivals). Kept: no cursor,
one step clearing at a time, the payoff held. Changed: a five-node diagram on
the page's own ground instead of cards in a well.
Beats: Lab result → Listing → Stock → Order → Handoff, each check landing as
the line to the next draws; payoff holds ~2.4s. Once.
Gate: `rehearsal passed` at 1280 and 390.
Film: `jump: fl-name width` candidates are the name's box resizing with its
state line; the name's ink doesn't move.

## coa-block
Gold: static-card (card layout, real words only on the focal row). Changed:
pinned with a bottom bleed instead of a satellite.
Beats: calm list → day rolls Oct 12 → 13 → listing drops to Draft with
"Lab result expired" → cursor links the new report, button confirms on itself
→ listing returns to Published, reason closes. Once. Poster: the blocked state.
Gate at 390: `rehearsal passed` (phone design drops the window chrome for a
plain sheet). At 1280: one line, see Unresolved.
Film: `jump: ss-button width` is the button easing to the shorter "Linked"
label within ~100ms; frames read cleanly (coa-link sheet).

## handoff-gate
Gold: stacked-cards. Kept: one width, one left edge, 12px gap, lower card off
the bottom. First tried a window with a satellite card (static-card), but the
visible window was narrower than tall (`framing:` line), so it became a stack.
Beats: payment taken → ID checked → Complete handoff unlocks as the last check
lands → pressed, confirms on itself, status rolls to Picked up. Once.
Gate: one line at both widths, see Unresolved.

## loyalty
Gold: fade-crop (window inset top and sides, dissolving at its foot by mask)
with table-edit's timing (the total rolls a beat after its cause).
Beats: record at rest → today's $48 pickup drops in at the top of the orders,
carrying the rest → points roll 264 → 312, visits 3 → 4. Once.
Gate at 390: `rehearsal passed`. At 1280: one line, see Unresolved.
Film: Count's digit reel reports `jump`/`settle snap` as the hidden reel
resets inside its clip; no visible hop in the frames.

## label
Gold: tilted-stack (paper; only the top card has words). Kept: three labels
at small alternating angles. The top label feeds down from above the tile
edge and lands. The QR is a real code for https://example.com/coa/1048
(`qr.ts`); warning text is placeholder lines, not invented statute.
Gate: `rehearsal passed` at 1280 and 390 (after flattening the placeholder
inks to opaque, `onion skin`).

## stock-reason
Gold: form-error (the button waits on the field that gates it).
Beats: −2 typed → Save stays disabled → Damaged picked, Save enables → saved:
entry drops into the log, On hand rolls 10 → 8. Once.
Gate: `rehearsal passed` at 1280 and 390 (after tightening the Reason label,
`loose stack`).

## Review (fresh eye) and response
- Three feature demos shared one centred-on-a-plate layout → COA now bleeds
  off the corner; handoff and loyalty sit on the page with no plate.
- Flow: empty lower half → stage cropped to the row; state labels swapped in
  a fixed cell (States) so no frame shows a bare dot; Handoff lands in the
  solid accent as the payoff.
- COA: bar rows where the eye lands → named neighbouring products; expiry
  copy shortened so it fits beside the badge at 390; reason drops in whole;
  cursor parks on empty margin.
- Handoff: cursor now presses each check and stays in view at the end.
- Loyalty: coloured avatar; a Member since stat fills the void; numbers roll
  as text (no digit-reel jump).
- Label: two labels side by side (one per line item), flat, with real
  adult-use warning words and a batch line; hidden until they feed.
- Stock: the missing-reason beat added (Save pressed, reasons ring, the lane
  says why); labels share one baseline; no card inside the tile; on-hand
  rolls as text.

## Unresolved (detector lines confirmed on the skill's own gold)
- `uneven gutters: div.ss-card …` on handoff-gate: the top card of a stack.
  The gold `stacked-cards` prints the same line (90/90/228px). Kept the
  layout the gold teaches.

## Assumptions
- Plays once rather than looping, so no data ever rewinds in view.
- At a 320px host the phone designs (358 wide) scale to ~0.78, putting 12px
  UI text near 9.5px. Not redesigned for 320.

## Not checked
- Safari and Firefox; touch devices; frame-rate profiling on the real page.
- Dark theme (the page has none).
