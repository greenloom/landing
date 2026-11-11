# Green Loom landing page

The public site at https://www.greenloom.com.

`site/` holds the whole site as static files, and GitHub Pages publishes it on
every push to `main` (`.github/workflows/deploy.yml`, no build step).

The page and its feature demos are developed in `greenloom/retail-admin`
under `landingpage/`. The demos are built there with `pnpm landing:demos`;
copy `landingpage/index.html` and the assets it references into `site/` to
update this repo.
