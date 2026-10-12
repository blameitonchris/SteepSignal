# SteepSignal real-data MVP

Prepared on 12 October 2026; source and GitHub Pages publication approved on 13 October 2026. This upgrade is implemented and tested locally. **The backend has not been deployed or connected to live YouTube yet**. No account or subscription was created and no paid service was used.

## What works now

Open **Real research** in either interface. Both use the same ES5 research-room script and the same protected server API. You can edit the five research candidates, discover videos when the owner connects YouTube, import Google Trends CSVs, add authorized observations, prepare an evidence-based roundup, save it, and open a linked tasting-notebook test. There is no AI subscription or AI key requirement.

Existing fictional data, watchlists, notebooks, calculations, CSV imports, JSON backups, exports, and weekly briefs remain available. Existing storage keys were not migrated or deleted. No existing private entries are automatically uploaded. Before changing hosts, export the original browser backup under Tasting notebook or Sources, and the research-room backup under Connection & backup.

## What is genuinely connected

The YouTube integration is implemented against the official YouTube Data API search endpoint. No server key exists in this environment, so automated checks used mock provider responses. **No live connection or genuine video findings were demonstrated here.** Google Trends uses user-exported files, not a live connection. Automated parser checks use fixtures, not proof of current tea trends. An actual exported CSV is required for a real-data demonstration.

The provider schema was fetched from Google's official `googleapis/google-api-go-client` repository on 12 October 2026 (schema revision 20261001). It confirms the search parameters, including `regionCode` meaning content displayed to viewers in that country. Live attempts to read Google developer policies, quota pages, and Trends help pages were blocked by this environment's network policy. **The owner must review the linked current terms, quotas, attribution, and retention rules before activating real collection.** The implementation is conservative but this is not a claim that a current policy review was completed.

Official references to review:

- [YouTube search.list](https://developers.google.com/youtube/v3/docs/search/list)
- [YouTube developer policies, including API data refresh/deletion rules](https://developers.google.com/youtube/terms/developer-policies)
- [YouTube API terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)
- [Quota costs](https://developers.google.com/youtube/v3/determine_quota_cost)
- [YouTube API project/key setup](https://developers.google.com/youtube/v3/getting-started)
- [Export Google Trends data](https://support.google.com/trends/answer/4365538?hl=en)
- [How Trends data is adjusted and sampled](https://support.google.com/trends/answer/4365533?hl=en)
- [Google Trends API alpha](https://developers.google.com/search/apis/trends) — outside this MVP; no alpha access is assumed.

## The simplest hosting option

Existing URLs remain unchanged:

- Main: https://blameitonchris.github.io/SteepSignal/
- Tablet: https://blameitonchris.github.io/SteepSignal/compatibility/

GitHub Pages serves files only. It cannot securely store an API key or run this Node server. The prepared Pages package adds Real research to both existing URLs, with a configurable **HTTPS research server address**. The preferred backend option is a **Render Free Node web service**; `render.yaml` is prepared. Render can also serve both app interfaces on its assigned HTTPS domain, so using that domain needs no cross-origin setup. Do not invent an actual Render URL before a service is created.

A Render account and GitHub repository access are needed. Choose Free explicitly, do not enable billing/paid plans or create a paid subscription, and check Render's current free-plan terms before proceeding. Free services commonly sleep when idle and may have a slow first request; exact current limits and availability were not verified here. No database is needed because this MVP does not store shared research on the server. A custom domain is unnecessary. A server key and random research access code are configured in the host's private environment settings.

The source and static Pages release are approved for publication; Render deployment has not been submitted. The release ZIP contains only allowlisted application source, server modules, fonts, build scripts, configuration placeholders, licenses, and this guide. It excludes real `.env` files, browser backups, private records, screenshots, tests, and workspace configuration. The approved backend source is published to this repository’s main branch. Connect main to Render, using `node scripts/build-compatibility.js` as build command and `node server/server.js` as start command. The GitHub Pages assets are a separate allowlisted release and preserve the original URLs.

Public website visitors can inspect the interface and fictional demo. Research processing/collection requires the owner-provided access code. Do not put that code in a URL, chat, repository, or notebook. Share it privately only with trusted demonstration participants. A code is a small-team access control, not individual accounts or enterprise identity. Rotate it in host settings when access should end.

## Configure YouTube, step by step

1. Sign into [Google Cloud Console](https://console.cloud.google.com/) with your own Google account. Create a project such as SteepSignal research.
2. Under APIs & Services → Library, find **YouTube Data API v3** and select Enable.
3. Under Credentials, create an **API key**. Restrict its API access to YouTube Data API v3. This is a **server** key; a website/referrer-restricted key is not suitable for server requests. If the chosen hosting plan provides stable outbound IPs, restrict the key to those IPs; otherwise keep the API restriction and stringent quota limits. Review Google's current security recommendations.
4. In the research server's private environment settings, set `YOUTUBE_API_KEY` to the key. Never paste it into frontend fields or commit it to Git.
5. Generate a separate random access code, for example with `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` on your own trusted terminal. Set that as `RESEARCH_ACCESS_CODE`. The server refuses startup without a code of at least 16 characters.
6. Set `ALLOWED_ORIGINS=https://blameitonchris.github.io` if you will use the original Pages URLs. The server's own origin is allowed automatically. Avoid a wildcard.
7. Leave `YOUTUBE_DAILY_SEARCH_LIMIT=10` initially. Review the project's quota in Google Cloud and set a suitable hard daily cap there too. One UI action makes one search.list call, at most 25 results, with no extra pages or videos downloads. Search historically costs 100 quota units per call; check the linked current quota documentation rather than treating that as a verified current price. Request counts are not dollars, and no paid quota increase is requested by this app.
8. Restart the service. Open Real research → Connection & backup. Enter the server HTTPS address if using GitHub Pages, plus the **research access code**, not the API key. Check connection. “Key configured” means only that a key is present; a successful search is what verifies provider access.
9. Choose a topic, search phrase, and dates. Click Find recent mentions. Check real titles, publication dates, YouTube links, collection time, source label, and limitations. Quota, disabled API, access refusal, timeout, missing-key, and empty-result messages are explicit.

The server uses a per-address request limit, at most two concurrent provider searches, and a small global daily search budget. It does not trust forwarded IP headers. Limits are held in process memory; restarts/multiple instances reset or multiply them. **Use the Google project quota cap as the durable spending/usage boundary.** A stronger multi-user production deployment would need durable rate accounting and individual authentication, outside this small-team demonstration.

## Export and import US search interest

1. Open [Google Trends Explore](https://trends.google.com/trends/explore?geo=US).
2. Add the terms you want to compare in the **same comparison chart**. Choose United States, dates, category, and search type. Search terms and Google Topics are different: preserve the exact exported labels and record your settings.
3. Use the download icon on **Interest over time**. Regional and related-query exports are different formats and are rejected here.
4. In SteepSignal, choose Imported Google Trends data / Search interest. Choose the CSV file or paste its text (paste works on older tablets).
5. Preview the periods and values. Introductory metadata, quoted names, multiple terms, Day/Week/Month, zero, `<1`, and missing cells are supported. Localized headers, hourly timestamp exports, regional tables, and malformed CSVs receive an error rather than a guessed result. Re-export a daily/weekly/monthly English interest-over-time chart if necessary.
6. Confirm geography, category, search type, and export date. A CSV does not reliably contain all settings or its export timestamp. Enter Unknown or leave the export date blank when it cannot be verified. Do not mark Worldwide as United States. Only confirmed-US imports appear in US briefs.
7. Save. The file is labeled **Imported real data — Google Trends**, with its own date range and import time. Each file retains its own scale. The UI does not merge levels from different exports or calculate a blended trend score. Missing and `<1` values remain distinct; `<1` is not converted to zero.

The importer processes CSV on the server but saves the confirmed import only in this browser. It sends nothing to Google Trends. Large tables display 100 periods at a time; all accepted periods remain in the browser backup. Month/Week dates are period starts, not daily observations; date-range selection includes those period-start dates and does not interpolate daily values.

## Evidence, privacy, and retention

YouTube result sets are **session-only**. They are never written to localStorage, server disk, downloaded research backups, or saved roundup snapshots. They expire after 24 hours and must be recollected to appear as video evidence again. There is no server cache or shared provider database. Saved roundups keep authorized observations, Trends files, and the owner's hypothesis; reopening one makes the absent video snapshot clear. Thumbnails are shown only after an explicit button click and link to YouTube-owned image URLs. YouTube attribution and source links remain visible. No playback, downloading, scraping, transcripts, sentiment classifier, watch metrics, or sales inference is implemented.

Users can print or copy a live roundup. Those user-created copies cannot be remotely refreshed or deleted; do not treat them as current findings later, do not republish stale provider data, and review the provider's current distribution/retention requirements before external sharing. Clearing a tab removes its provider memory. A research-room backup contains no provider API metadata or access code. Delete research items in the UI; saved roundup snapshots can still contain authorized observations or Trends data until the corresponding roundup is also removed. Remove any private copies/backups yourself.

Research candidates, Trends exports, manually reviewed observations, and saved roundups use the separate `steepsignal.research.v1` browser store. Both interfaces share that research only on the **same website origin and browser profile**. Another computer/browser profile has a separate store; research can be transferred deliberately using the research backup. Original main and tablet notebook/watchlist stores remain separate and unchanged. No record becomes a shared team record merely by opening the site. The host receives only explicitly requested research payloads; it does not retain them in an app database. Normal host connection logs/privacy terms still apply.

Source URL, publication date, quote-versus-interpretation, geography basis, and authorization confirmation are required for new manual observations. Unknown and inferred US locations stay separate from confirmed-US observations. Video US availability is never used as proof of origin or audience. Existing manual records are not migrated automatically.

## Five-minute demonstration

Prepare first: configure and verify the server key, privately enter the access code, export a genuine US Trends comparison CSV, and use only authorized non-sensitive feedback. Do not use test fixtures as real findings.

1. **Minute 1:** Show the fictional demo label, then switch to Real research. Point out the five editable research candidates and choose Matcha.
2. **Minute 2:** Find recent mentions over a recent date range. Open a real YouTube link and explain the query, collection time, 25-result limit, and unknown audience/creator geography.
3. **Minute 3:** Import the genuine US Trends CSV, confirm settings, and inspect its relative values. Explain that search interest is not sales, and independent files cannot be combined on one common scale.
4. **Minute 4:** Add one authorized feedback observation if you have it. Create a roundup for the topic and same dates. Explain the source links, missing evidence, coverage gaps, and lack of a historical momentum claim.
5. **Minute 5:** Save the roundup, create the linked tasting test, and show empty sales/feedback fields. Print/save as PDF if supported. Present the hypothesis as something to test, not validated demand or a market forecast.

Without a configured key, the honest demonstration is the disconnected state plus genuine Trends import/manual research/briefing. Those processing actions still need the running research backend and its access code, but no YouTube or AI credentials. On GitHub Pages without a backend, only the original demo and local research editing work.

## Run and verify locally

Node 24 is used; no runtime npm dependencies are required.

```sh
cp .env.example .env
# Edit .env locally. Add a random RESEARCH_ACCESS_CODE.
# Leave YOUTUBE_API_KEY empty until a real key is securely configured.
npm run start:research
```

Local main and tablet paths are `/` and `/compatibility/`; `#research` opens the new room. A local address is not a share link for another computer. There is no authenticated external preview forwarding tool in this cloud session. Regenerated `SteepSignal.html`, `pages-demo/`, and the release ZIP are review artifacts. The original Pages URLs are retained; no Render URL exists until the backend service is created.

```sh
npm test
npm run test:research
# Browser suites need Playwright and Chromium in the developer environment;
# ES5 syntax checks also need Acorn. They are test-only tools, not app dependencies.
npm run test:research-browser
npm run prepare:pages
npm run test:pages
npm run test:compatibility
npm run prepare:research
```

Checks passed: original data/math/imports, protected endpoint and provider mock errors, duplicate handling, Trends settings and value distinctions, per-export scales, evidence segregation, both UI workflows, linked tests with empty measured results, original storage preservation, backups without credentials/provider metadata, ES5 syntax and simple CSS, responsive layouts, labeled PDFs. Actual live discovery, physical Android 4.2.2, Google current terms/quota pages, Render account availability, and live deployment remain unverified.

**Old-tablet hosting limitation:** HTTPS/TLS and certificate trust can fail before the code runs. Try the actual published HTTPS main/tablet pages on the device after deployment. Do not disable certificate verification or expose an HTTP endpoint to bypass this. If its browser cannot negotiate the host's HTTPS, use a supported OS/browser/device; a code-only compatibility page cannot fix TLS support.
