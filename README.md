# Durga-puja · जय माता दी

A responsive, dependency-free bhajan reader with the original invitation and eight complete songs in Hindi and Roman Hindi.

## Features

- Original invitation shown for four seconds after loading, once per tab session; pause or enter immediately.
- Numbered index with search in Hindi, Roman Hindi, or by song number.
- Hindi / English (Roman Hindi) switch; remembered language and font size.
- Reader with adjustable 18–36 px text, Instagram reference, index and previous/next controls.
- Swipe right for next; swipe left for previous. Vertical scrolling remains available.
- No wraparound at first or last song. Direct song URLs: `/#song/1` through `/#song/8`.
- Offline shell and lyrics after a successful initial online load; external Instagram references require internet.
- Keyboard focus states, reduced-motion support, invitation focus containment and safe-area spacing.

## Source and text integrity

`content/songs-original-hi.txt` is the supplied corrected file, retained unchanged.
`content/songs-roman.txt` is its complete Roman Hindi counterpart, including headings and links.
`songs.json` contains the eight paired entries used by the app.
`content/transliteration-map.txt` records the manually chosen transliteration of every Hindi word.

All punctuation, spaces within lyrics, blank stanza lines and repeated lyrics are retained. Devanagari danda marks remain danda marks in Roman Hindi. No spelling corrections have been silently introduced. Purely separating blank lines around song blocks are excluded from the app entries but retained in the full text files. Long source lines wrap naturally on mobile; their underlying line breaks remain unchanged.

To regenerate paired content after an intentional source/map update:

```sh
python3 scripts/prepare-content.py
npm test
npm run build
```

Automated checks validate structural fidelity, not pronunciation. Roman Hindi is a readable pronunciation convention, not a reversible academic transliteration standard. Instagram URLs were preserved from the supplied file; reel content and availability have not been verified.

## Build and local use

Requires Node.js 20 or later. No npm packages or secrets are required.

```sh
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Visit http://localhost:8080. Opening index.html directly via file:// will not load JSON or the service worker.

## GitHub Pages

Repository: https://github.com/searchdavidf/PankajPuja

To host this app directly from GitHub:

1. Open repository Settings → Pages.
2. Under Source choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then Save.
4. After GitHub finishes publication, open https://searchdavidf.github.io/PankajPuja/.

The root contains all static assets and `.nojekyll`, so no build workflow is required for GitHub Pages. All asset links are relative and song URLs use hash routing, allowing deployment under `/PankajPuja/`. `vercel.json` is ignored by GitHub Pages. The repository is public. The supplied invitation contains venue and contact details and will be displayed by the site.

## Vercel preparation

`vercel.json` configures a static build:

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root
- Environment variables: none

In Vercel choose Add New → Project, import `Durga-puja`, confirm the intended team and the settings above, then deploy. No Vercel project or deployment has been created yet. Preview/production release remains a separate operation.

## Validation performed

- Four Node test groups pass: whole-document structure, eight distinct references, per-song fidelity, and complete source extraction.
- JavaScript syntax checks pass for app and service worker.
- Production static build passes.
- Browser visual, touch-swipe, offline and device checks have not been performed in the current environment. Check iOS Safari and Android Chrome before an event release.

## Maintenance

When changing offline assets, increment the cache version in `sw.js`. Network-first requests retrieve new versions online; a newly installed service worker becomes active once older controlled tabs close.
