// The seven guide scenes, as data. Every label, button and status word is the
// app's own (greenLoomv2 src/components/admin/…, see ../REHEARSAL.md); the shop,
// customer and numbers are sample data. A scene is a list of steps; a step is the
// screens the card passes through, and the script presses `press` (default: the
// button) to move from each screen to the next.

export type Tone = 'neutral' | 'info' | 'pending' | 'success' | 'danger'
export type Row =
  | { k: 'fact'; label: string; value: string; tone?: Tone; note?: string }
  | { k: 'tick'; text: string; on: boolean }
  | { k: 'field'; label: string; value: string; hot?: boolean }
  | { k: 'say'; text: string }
export type Beat = {
  crumb: string
  title: string
  tag?: { word: string; tone: Tone }
  rows: Row[]
  act: string
  locked?: boolean
  note?: string
  lane?: number
  press?: 'act' | 'tick' | 'field'
}
export type Scene = { steps: Beat[][] }

const fact = (label: string, value: string, tone?: Tone, note?: string): Row => ({ k: 'fact', label, value, tone, note })
const tick = (text: string, on: boolean): Row => ({ k: 'tick', text, on })
const field = (label: string, value: string, hot = false): Row => ({ k: 'field', label, value, hot })
const say = (text: string): Row => ({ k: 'say', text })
const tag = (word: string, tone: Tone) => ({ word, tone })

const O = 'GL-4F2A91C0'
const PRODUCT = 'Coastal Haze Gummies · 20 ct'
const ID_TICK = 'I collected $42.00 and checked the customer’s government ID and they are of legal age.'

// ── 1. A vendor drops off a case with its lab report (Manager) ──────────────
const addProduct: Scene = {
  steps: [
    [
      { crumb: 'Catalog', title: 'Products', rows: [fact('Coastal Haze Gummies', 'Published', 'success'), fact('Night Owl Chews', 'Draft', 'neutral'), fact('Lemon Drop Gummies', 'Published', 'success')], act: 'Add with AI' },
      { crumb: 'Catalog › Add with AI', title: 'Add with AI', rows: [fact('Open drafts', '1')], act: 'Start a new draft' },
    ],
    [
      { crumb: 'Add with AI · Source', title: 'Step 1 of 4: Source', rows: [fact('Label photos', '2 added'), fact('Lab report', 'CH-0611.pdf'), fact('Read label', 'Not run', 'neutral'), fact('Read lab', 'Not run', 'neutral')], act: 'Fill everything' },
      { crumb: 'Add with AI · Source', title: 'Step 1 of 4: Source', rows: [fact('Label photos', '2 added'), fact('Lab report', 'CH-0611.pdf'), fact('Read label', 'Done', 'success'), fact('Read lab', 'Done', 'success')], act: 'Next' },
    ],
    [
      { crumb: 'Add with AI · Lab record and lot', title: 'Step 2 of 4: Lab record and lot', rows: [fact('Lab', 'Tidewater Labs'), fact('Valid until', 'Jun 1, 2027'), fact('THC · CBD', '0.28% · 1.1%'), field('Lot', '', true)], act: 'Next', locked: true, press: 'field' },
      { crumb: 'Add with AI · Lab record and lot', title: 'Step 2 of 4: Lab record and lot', rows: [fact('Lab', 'Tidewater Labs'), fact('Valid until', 'Jun 1, 2027'), fact('THC · CBD', '0.28% · 1.1%'), field('Lot', 'LOT-0611 · 24 units')], act: 'Next' },
    ],
    [
      { crumb: 'Add with AI · Review', title: 'Ready to save?', tag: tag('Draft', 'neutral'), rows: [fact('Product', PRODUCT), fact('Price', '$42.00'), fact('Lab record', 'Lab record checked', 'success')], act: 'Save and publish' },
      { crumb: 'Catalog › Products', title: 'Coastal Haze Gummies', tag: tag('Published', 'success'), rows: [fact('Option', '20 ct'), fact('Price', '$42.00'), fact('Available', '24')], act: 'Published', note: 'Shoppers see it on the menu.' },
    ],
  ],
}

// ── 2. Noon: the same-day window opens (Crew) ───────────────────────────────
const dl = (b: Omit<Beat, 'crumb' | 'title'> & { title?: string; crumb?: string }): Beat => ({ crumb: 'Orders › Board', title: `${O} · Delivery`, ...b })
const sameDay: Scene = {
  steps: [
    [
      dl({ lane: 0, tag: tag('Needs review', 'info'), rows: [fact('Fulfillment', 'Not started', 'neutral'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Accept…' }),
      dl({ crumb: 'Accept order', rows: [say('Payment: Due at handoff. Stock hold: Held. Accepting takes the held stock off the on-hand count.')], act: 'Accept order' }),
      dl({ lane: 1, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Scheduled', 'neutral'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Start packing' }),
    ],
    [
      dl({ lane: 1, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Scheduled', 'neutral'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Start packing' }),
      dl({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Packing', 'info'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Mark ready' }),
      dl({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Ready', 'success'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Dispatch…' }),
    ],
    [
      dl({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Ready', 'success'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Dispatch…' }),
      dl({ crumb: 'Dispatch to courier', rows: [say('Enter who is taking it out.'), field('Courier name', '', true)], act: 'Dispatch', locked: true, press: 'field' }),
      dl({ crumb: 'Dispatch to courier', rows: [say('Enter who is taking it out.'), field('Courier name', 'Jordan')], act: 'Dispatch' }),
      dl({ lane: 3, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Out for delivery', 'info', 'Jordan'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Confirm delivered…' }),
    ],
    [
      dl({ lane: 3, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Out for delivery', 'info', 'Jordan'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Confirm delivered…' }),
      dl({ crumb: 'Confirm delivery', rows: [tick(ID_TICK, false), field('Proof of delivery (who received it)', '', true)], act: 'Confirm delivered', locked: true, press: 'tick' }),
      dl({ crumb: 'Confirm delivery', rows: [tick(ID_TICK, true), field('Proof of delivery (who received it)', '', true)], act: 'Confirm delivered', locked: true, press: 'field' }),
      dl({ crumb: 'Confirm delivery', rows: [tick(ID_TICK, true), field('Proof of delivery (who received it)', 'Maya Ortiz')], act: 'Confirm delivered' }),
      dl({ lane: 3, tag: tag('Done', 'neutral'), rows: [fact('Fulfillment', 'Done', 'success'), fact('Payment', 'Paid', 'success'), fact('Age check', 'Age confirmed', 'success', 'ID at handoff by Dana')], act: 'Delivered' }),
    ],
  ],
}

// ── 3. A pickup customer is at the counter (Crew) ───────────────────────────
const pk = (b: Omit<Beat, 'crumb' | 'title'> & { title?: string; crumb?: string }): Beat => ({ crumb: 'Orders › Board', title: `${O} · Pickup`, ...b })
const readyPickup = (act: string): Beat => pk({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Ready', 'success'), fact('Payment', 'Due at pickup', 'pending'), fact('Age check', 'Age confirmed', 'success')], act })
const handoff: Scene = {
  steps: [
    [readyPickup('Hand off…'), pk({ crumb: 'Hand off at the counter', rows: [say('Goods change hands only after the customer’s ID and age are checked. Collect $42.00: completing this records it as paid.'), tick(ID_TICK, false)], act: 'Complete handoff', locked: true, press: 'tick' })],
    [
      pk({ crumb: 'Hand off at the counter', rows: [say('Goods change hands only after the customer’s ID and age are checked. Collect $42.00: completing this records it as paid.'), tick(ID_TICK, false)], act: 'Complete handoff', locked: true, press: 'tick' }),
      pk({ crumb: 'Hand off at the counter', rows: [say('Goods change hands only after the customer’s ID and age are checked. Collect $42.00: completing this records it as paid.'), tick(ID_TICK, true)], act: 'Complete handoff' }),
      pk({ lane: 3, tag: tag('Done', 'neutral'), rows: [fact('Fulfillment', 'Done', 'success'), fact('Payment', 'Paid', 'success'), fact('Age check', 'Age confirmed', 'success', 'Customer’s ID was checked at handoff.')], act: 'Handed off' }),
    ],
    [
      readyPickup('Record exception…'),
      pk({ crumb: 'Record an exception', rows: [say('The fulfillment stays open. You can retry it or cancel it afterwards.'), field('What went wrong', '', true), field('What happened', '')], act: 'Record exception', locked: true, press: 'field' }),
      pk({ crumb: 'Record an exception', rows: [say('The fulfillment stays open. You can retry it or cancel it afterwards.'), field('What went wrong', 'ID check failed'), field('What happened', 'ID expired')], act: 'Record exception' }),
      pk({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Needs attention', 'danger'), fact('Exception', 'ID check failed', 'danger'), fact('Payment', 'Due at pickup', 'pending')], act: 'Retry', note: 'Or Cancel fulfillment…' }),
    ],
  ],
}

// ── 4. The driver is back: nobody was home (Crew) ───────────────────────────
const out = (act: string, extra: Partial<Beat> = {}): Beat => dl({ lane: 3, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Out for delivery', 'info', 'Jordan'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act, ...extra })
const notHome: Scene = {
  steps: [
    [out('Record exception…'), dl({ crumb: 'Record an exception', rows: [say('The fulfillment stays open. You can retry it or cancel it afterwards.'), field('What went wrong', '', true), field('What happened', '')], act: 'Record exception', locked: true, press: 'field' })],
    [
      dl({ crumb: 'Record an exception', rows: [say('The fulfillment stays open. You can retry it or cancel it afterwards.'), field('What went wrong', '', true), field('What happened', '')], act: 'Record exception', locked: true, press: 'field' }),
      dl({ crumb: 'Record an exception', rows: [say('The fulfillment stays open. You can retry it or cancel it afterwards.'), field('What went wrong', 'Customer not home'), field('What happened', 'Rang twice, no answer')], act: 'Record exception' }),
      dl({ lane: 3, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Needs attention', 'danger'), fact('Exception', 'Customer not home', 'danger'), fact('Payment', 'Due at handoff', 'pending')], act: 'Retry', note: 'Or Cancel fulfillment…' }),
    ],
    [
      dl({ lane: 3, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Needs attention', 'danger'), fact('Exception', 'Customer not home', 'danger'), fact('Payment', 'Due at handoff', 'pending')], act: 'Retry', note: 'Or Cancel fulfillment…' }),
      dl({ lane: 2, tag: tag('Accepted', 'success'), rows: [fact('Fulfillment', 'Ready', 'success'), fact('Payment', 'Due at handoff', 'pending'), fact('Age check', 'Age confirmed', 'success')], act: 'Dispatch…', note: 'Ready for another attempt.' }),
    ],
  ],
}

// ── 5. A customer asks "where's my order?" (Crew) ───────────────────────────
const th = (b: Omit<Beat, 'crumb' | 'title'> & { title?: string; crumb?: string }): Beat => ({ crumb: 'Orders › Messages', title: 'Messages', ...b })
const messages: Scene = {
  steps: [
    [th({ rows: [fact('Order GL-4F2A91C0', 'Waiting', 'pending'), fact('Order GL-81D3E5B7', 'Answered', 'neutral'), fact('Order GL-09C6A2F4', 'Answered', 'neutral')], act: 'Open the thread' })],
    [
      th({ title: `Order ${O}`, rows: [say('Maya Ortiz: Hi, any update on my order?'), field('Message', '', true)], act: 'Send', locked: true, press: 'field' }),
      th({ title: `Order ${O}`, rows: [say('Maya Ortiz: Hi, any update on my order?'), field('Message', 'Packing. Leaves at 2.')], act: 'Send' }),
    ],
    [
      th({ rows: [fact('Order GL-4F2A91C0', 'Answered', 'neutral'), fact('Order GL-81D3E5B7', 'Answered', 'neutral'), fact('Order GL-09C6A2F4', 'Answered', 'neutral')], act: 'Answered', locked: true, note: 'Waiting threads show first.' }),
    ],
  ],
}

// ── 6. The closing count is two short (Crew) ────────────────────────────────
const st = (b: Omit<Beat, 'crumb' | 'title'> & { title?: string; crumb?: string }): Beat => ({ crumb: 'Catalog › Stock', title: 'Stock', ...b })
const count: Scene = {
  steps: [
    [st({ rows: [fact(PRODUCT, '24 on hand'), fact('Night Owl Chews · 10 ct', '8 on hand'), fact('Lemon Drop Gummies · 20 ct', '15 on hand')], act: 'Adjust' })],
    [
      st({ title: 'Adjust stock', rows: [fact('Product', PRODUCT), say('24 on hand here, 0 reserved, 24 available.'), field('Change', '', true), field('Reason', '')], act: 'Save adjustment', locked: true, press: 'field' }),
      st({ title: 'Adjust stock', rows: [fact('Product', PRODUCT), say('24 on hand here, 0 reserved, 24 available.'), field('Change', '-2'), field('Reason', 'Cycle count')], act: 'Save adjustment' }),
    ],
    [st({ title: 'Adjust stock', rows: [fact('Product', PRODUCT), say('22 on hand here, 0 reserved, 22 available.'), fact('History', '-2 · 24 → 22', 'neutral', 'Cycle count · Dana')], act: 'Saved', locked: true })],
  ],
}

// ── 7. A driver called in sick on Friday (Manager) ──────────────────────────
const ps = (b: Omit<Beat, 'crumb' | 'title'> & { title?: string; crumb?: string }): Beat => ({ crumb: 'Store › Pauses & closures', title: 'Pauses & closures', ...b })
const pause: Scene = {
  steps: [
    [ps({ rows: [fact('Local delivery', 'Open', 'success'), fact('Pickup', 'Open', 'success'), fact('Shipping', 'Open', 'success')], act: 'Pause methods' })],
    [
      ps({ title: 'Pause methods', rows: [tick('Local delivery', false), field('Reason', '', true), field('Notice shoppers see', '')], act: 'Pause methods', locked: true, press: 'tick' }),
      ps({ title: 'Pause methods', rows: [tick('Local delivery', true), field('Reason', '', true), field('Notice shoppers see', '')], act: 'Pause methods', locked: true, press: 'field' }),
      ps({ title: 'Pause methods', rows: [tick('Local delivery', true), field('Reason', 'Driver out sick'), field('Notice shoppers see', 'Delivery paused today.')], act: 'Pause methods' }),
    ],
    [
      ps({ tag: tag('Paused', 'pending'), rows: [fact('Local delivery', 'Paused', 'pending', 'until resumed'), fact('Pickup', 'Open', 'success'), fact('Shipping', 'Open', 'success')], act: 'Resume now' }),
      ps({ rows: [fact('Local delivery', 'Open', 'success'), fact('Pickup', 'Open', 'success'), fact('Shipping', 'Open', 'success')], act: 'Resumed', locked: true }),
    ],
  ],
}

export const SCENES: Record<string, { scene: Scene; label: string }> = {
  'guide-add-product': { scene: addProduct, label: 'Adding a product from a vendor’s lab report with Add with AI' },
  'guide-same-day': { scene: sameDay, label: 'Moving a same-day delivery order across the Board' },
  'guide-handoff': { scene: handoff, label: 'Handing off a pickup order at the counter' },
  'guide-not-home': { scene: notHome, label: 'Recording a delivery where nobody was home' },
  'guide-messages': { scene: messages, label: 'Answering a customer’s message' },
  'guide-count': { scene: count, label: 'Adjusting stock after a count' },
  'guide-pause': { scene: pause, label: 'Pausing local delivery' },
}
