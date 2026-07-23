# Maxwell Advisory website (Astro)

A code-based rebuild of maxwelladvisory.eu. The site is static: no WordPress,
no database, no build-time content fetching. Every page renders identically to
the original. The shared header and footer are Astro components you edit once
(`src/components/Header.astro`, `src/components/Footer.astro`); each page lives
in `src/pages/` and pulls its content from `src/chunks/`.

## One-time setup

1. **Add the site assets.** Copy the `wp-content` and `wp-includes` folders from
   your Simply Static export into `public/`, so you have:
   `public/wp-content/...` and `public/wp-includes/...`
   (These hold the images, CSS, JavaScript and fonts. They are not included in
   this bundle because you already have them in the export.)

2. **Set the base path** in `astro.config.mjs`. For a GitHub Pages project repo
   the site is served at `https://<user>.github.io/<repo>/`, so `base` must be
   `"/<repo>"`. This bundle defaults to `"/maxwell-web"`, so if you name the repo
   `maxwell-web` it works as-is. Otherwise change `base` to match your repo name.

3. **Install and preview locally** (optional):
   ```
   npm install
   npm run build
   npm run preview
   ```

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `maxwell-web`).
2. Commit and push everything, including `public/wp-content` and
   `public/wp-includes`.
3. In the repo: Settings > Pages > Build and deployment > Source: **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on
   every push to `main`. The live test URL appears in the Actions run summary,
   typically `https://<user>.github.io/<repo>/`.

## Notes

- **Test deploy is set to no-index.** `public/robots.txt` disallows crawling and
  every page carries `<meta name="robots" content="noindex, nofollow">` so the
  test site cannot affect your live search rankings. Remove these before any
  production launch.
- **Editing.** Header/footer: edit the two component files. Page text: open the
  relevant file in `src/pages/` (or its chunk in `src/chunks/`) and edit the
  markup. The markup is Elementor's original output, preserved for exact
  fidelity; it can be cleaned up page by page later without changing appearance.
- **Moving to a real domain later.** Set `base` to `"/"` and `site` to the real
  domain in `astro.config.mjs`.
