# SteepSignal

**Tea trends. Clear insights.** A friendly tea research space with a clearly fictional demo, a protected real-research workspace, and browser-local tasting notebooks. The fictional demo needs no credentials. Real research needs the prepared Node backend and access code; YouTube discovery also needs a server-side API key. No AI service or paid subscription is required.

## Run the preview

```sh
cd /workspace/SteepSignal
npm start
```

Open port **3000** in your development environment's preview, or visit `http://localhost:3000` on the machine running the server. Requires Python 3; Node 18+ provides the convenience scripts and data tests. Static files can also be served by any ordinary HTTP server. Do not open `index.html` directly: JavaScript modules need HTTP. This is a development preview, not a production deployment.

## What works

- Responsive dashboard with search, category, temperature, consumption setting, source, geographic scope, and 7/30/90-day or custom date filters.
- Record-derived counts, unique-post history charts, equivalent-period growth, topic evidence, small-sample flags, explicit requests, and evidence-backed experiment suggestions.
- Watchlist for topics, ingredients, requests, and fictional brands; create/edit/delete product experiments with optional actual price, units, feedback, and next steps.
- Seven-day research briefs with a selectable beginning date, print/save-as-PDF styles, and CSV record exports. Print via the Weekly brief button and choose Save as PDF in the browser's print dialog.
- Sources & coverage: manual entry, downloadable CSV template, row-level import errors, and duplicate handling. Valid rows import even if other rows fail; review the reported results.
- Browser-data JSON backup and validated restore. Restore explicitly asks before replacing existing data.

The fixed demo clock is October 9, 2026. All demo records and brands are fictional, with no source links or purported genuine quotations. “Demo data — not live research” stays visible and travels with CSVs and printed reports. The default 30-day window has 450 records. Demo and imported data are separate datasets; choose **Your observations** after importing. Imported observations are not independently verified.

## Storage and methodology

Watchlist, experiments, and imported records persist in this browser's localStorage. Use Backup browser data to keep a copy. Different browsers/origins do not share data; clearing site data removes it. This is not secure multi-user business storage. Experiment results are business-entered and never fabricated or included in social research totals.

CSV fields: `id,published,topic,category,temp,setting,source,geo,geoBasis,kind,request,complaint,text,url`. Dates use YYYY-MM-DD. Temperature is Hot/Iced/Mixed; setting is At home/Away from home/Unknown / mixed; geography is confirmed_us/inferred_us/unknown; kind is positive/negative/request/observation. Required requests and complaints must be supplied for their respective record kinds. URLs, when supplied, must be HTTP(S). Use real publication dates, document the basis of US relevance, and supply genuine source links where available. Unknown location is excluded from US totals by default; English alone does not establish US relevance.

Duplicates are detected by ID, repeated source URL, or normalized text plus publication date, including within a file. Altered or cross-date reposts still need human review. Counts describe unique records in this dataset, not total platform or US market activity. Growth is `(current − previous) / previous × 100` for an equal preceding period; zero baseline displays “New in collected data.” Fewer than 20 records is a small sample. Views, likes, and posts are never combined.

## Validation

```sh
npm test
```

Data tests verify date boundaries, coherent totals, growth, filtering, geography exclusion, CSV escaping, duplicate handling, invalid dates, and unsafe source URLs. Chromium/Playwright browser validation additionally exercised filters and evidence, persistent watchlists, notebook creation/edit/deletion, manual observations, CSV exports with demo labels, PDF generation, mobile width, and absence of JavaScript errors. A browser suite is in `tests/browser.cjs`; run `NODE_PATH=/path/to/node_modules node tests/browser.cjs` with Playwright installed and Chromium at `/usr/bin/chromium`. Run `NODE_PATH=/path/to/node_modules node tests/import-browser.cjs` for CSV, custom-range, wishlist, and backup/restore flows. Start the app first. Tests use an isolated browser context and do not alter your personal browser data.

## Real research next

Start with a small authorized CSV and review its source provenance, geography, and duplicate/repost coverage. `providers.js` defines the deliberately disconnected provider boundary; no live API, scraper, automatic email, or AI summarizer is implemented. Before connecting a provider, review current official documentation, permitted use, credentials, pricing, and limits. Add a backend to hold keys and normalize retrieved evidence with genuine URLs, publication dates, and geographic basis. Only mark connections successful after a real request. Future summaries must cite retrieved records, report insufficient evidence, and treat record text as data rather than instructions.

Scheduled notifications, team accounts, advanced forecasting, and broader live coverage are future work. The approved demo assets have been pushed to GitHub’s `gh-pages` branch. Pages activation and live-link verification remain pending; see DEPLOYMENT.md.

## Visual identity and responsive checks

The interface uses a warm ivory background, forest navigation and actions, sage surfaces, and restrained amber accents. Locally bundled Lora headings pair with Nunito Sans controls and readable numbers in the main app. The tablet version uses Georgia and Arial. No font CDN or runtime package is required; font licenses and provenance are in `fonts/`. The cup-and-leaf mark and botanical introduction are local SVGs. `style.css` defines reusable palette and spacing styles; `ui.js` supplies decorative icons. Phone navigation is a labeled disclosure with an Escape shortcut, tables scroll inside their own regions, and reduced-motion preferences are respected.

Run `NODE_PATH=/path/to/node_modules node tests/design-browser.cjs` with the same Playwright/Chromium prerequisites as the other browser checks. It checks all seven sections at 1440, 1024, 768, 390, and 320 pixels, mobile navigation and dialogs, demo-label visibility, reduced motion, and printed topic names. Printable briefs include the SteepSignal identity and a repeated demo footer. The redesign retains all existing datasets, storage keys, research calculations, imports, exports, experiments, and backups.

## Standalone HTML preview

`SteepSignal.html` is a self-contained version of the app, similar to a single-file HTML preview. Open it directly in a browser or a compatible HTML file viewer; no localhost server or network connection is required. It includes the code, sample dataset, styles, and SVG assets. Regenerate it after source changes with `npm run build:preview`.

Chromium checks verified the bundled HTML over HTTP: default totals, filtering, watchlist and notebook persistence, and CSV export. Direct file opening could not be tested in the cloud browser because its administrator policy blocks file URLs. Browser storage belongs to the preview's origin: use a JSON backup to transfer existing watchlists, observations, and experiments from the server preview to the standalone preview. A file viewer that disables JavaScript cannot run the app; open the downloaded HTML in a full browser in that case.

## Preparing a public demo

Run `npm run prepare:share` to produce `SteepSignal-share-demo.zip`, a strict three-file static deployment with only fictional sample content and separate visitor-local storage. See [DEPLOYMENT.md](DEPLOYMENT.md) for the reviewed free Cloudflare Pages option, privacy details, validation, and beginner upload instructions. The owner has approved GitHub Pages publication and the demo assets are on `gh-pages`; hosting activation remains pending. Run `npm run test:share` with Playwright available to test the packaged site and visitor isolation.


## GitHub Pages, matching RokaWright

The preferred sharing route is now GitHub Pages. `npm run prepare:pages` produces the strict public allowlist in `pages-demo/` and `SteepSignal-github-pages.zip`. `npm run test:pages` (with Playwright available) tests it under `/SteepSignal/`. After approval, publish only those files to `gh-pages` and enable branch-based Pages in GitHub settings. The expected website address is `https://blameitonchris.github.io/SteepSignal/`; the release files have been pushed to `gh-pages`, but site activation and the live address remain unverified. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup, free/public versus private-plan requirements, and visitor storage. No Cloudflare account is needed for this option.


## Approved GitHub Pages release status

The approved demo release was pushed to `gh-pages` on October 9, 2026 (commit `5d9a050e2231e530c9b4257a3fdfc698fd71b2c2`). Complete the GitHub Pages setting described in DEPLOYMENT.md. Future changes can be built and reviewed in the development checkout, tested, and released to that same branch without changing the public address or the shared demo's storage keys. Do not overwrite visitor-local browser data in future builds. The remote main branch has not been changed by this publication.

## Older tablet version

A separate ES5 interface is in `compatibility/`, intended for the online-only tablet URL `https://blameitonchris.github.io/SteepSignal/compatibility/`. It keeps the main app separate and uses `steepsignal.compat.v1` storage. Tables replace charts; date inputs use YYYY-MM-DD; exports/backups offer copyable text and restore supports paste. Build with `npm run build:compatibility`, test with `npm run test:compatibility` (developer-only Acorn and Playwright), and deploy the isolated subtree with `npm run publish:compatibility`. See [COMPATIBILITY.md](COMPATIBILITY.md) for device checks, HTTPS limitations, and the precise verification scope. Physical Android 4.2.2 operation is not yet verified.

## Real-data MVP (backend activation pending)

Both interfaces now include **Real research**: a protected official YouTube discovery endpoint, a separate Google Trends interest-over-time importer, editable research candidates, authorized quote/interpretation observations, evidence-based roundups, and linked tasting tests. The original fictional demo and browser-local saved entries remain unchanged. No live YouTube key is configured in this workspace; provider verification is mocked.

Read [the setup, hosting, privacy, limitations, and five-minute demonstration guide](docs/REAL-DATA-MVP.md). `npm run start:research` runs the Node server with a private `.env`; `npm run prepare:research` creates an allowlisted deployment ZIP. GitHub Pages needs this separate backend to run discovery/import processing. `render.yaml` prepares a Free Node service, but no host account or new deployment has been created.
