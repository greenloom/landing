# Green Loom landing page

The public site at https://www.greenloom.com.

- `site/` is the page (`index.html`) and its static assets.
- `demos/` holds the feature demos: small StageShow scenes (React) built into
  `site/assets/demos/`. The StageShow kit is vendored in `demos/kit/` under its
  MIT licence. `demos/REHEARSAL.md` records how each demo was checked.

```bash
npm install
npm run build      # build the demos into site/assets/demos
npm run serve      # http://localhost:8765
npm run typecheck
```

Pushing to `main` deploys: the Pages workflow installs, builds the demos and
publishes `site/` (`.github/workflows/deploy.yml`).
