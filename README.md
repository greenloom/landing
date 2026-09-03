# Green Loom Landing

Public marketing site for Green Loom. Static Astro site, dark ground only. No docs chrome.

## One scrolling page

- Hero: “Unfuck your shit.” Subhead names the mess: two systems that don’t talk, order vs shelf. Lime gradient on Unfuck.
- CTA: **Book a walkthrough** (only).
- Two short sections: (1) two systems that don’t talk, (2) order vs shelf (Package).
- Final Book a walkthrough.
- Window: 44rem square browser bezel + blank title bar. Viewport is clear. Inside: OperatorShell with bare OrdersPanel (list) + OrderDetailMain in a `bg-muted p-6` well. Store name “Midtown” lives in the shell. No catalog, no pills, no captions, no second title on the glass.

## Depends on the design system

Imports OperatorShell, OrdersPanel, OrderDetailMain from `@greenloom/ui` (or the local design-system stand-in). Recipes are not copied or redrawn here.

## Requirements

- Node.js **22.12+**
- npm 10+

## Develop

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Deploy

Deploys from `main` to the custom domain via the existing workflow. CNAME is `www.greenloom.com`.

## Design notes

- Dark olive/black ground. Lime `#a3e635` accent.
- Figtree. No invented metrics or stats.
- Glass effects (frost/rim/sheen + optional displacement) are bezel-only and @supports-gated. No overlay over the shell. `prefers-reduced-motion` disables motion.

## License

Code in this repo is available for Green Loom product use.
