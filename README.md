# backstage_

**The view your audience never sees.**

A browser-based presenter for Beamer PDFs. Drop your PDF and open an audience window — the two stay in sync automatically via BroadcastChannel. No server, no account, nothing to install.

## How to use

1. Open the app and click **Open a presentation**
2. Drop your Beamer PDF (compiled with `\setbeameroption{show notes on second screen=right}`)
3. Click **Start Presenting** — you'll see the current slide, next slide preview, and your speaker notes
4. Click **Open audience view** to open the second window — it shows only the current slide, full screen

The two windows stay in sync automatically. Works entirely in the browser; your PDF never leaves your device.

## Browser requirements

Chrome, Firefox, or Edge on desktop. Safari 15.4+ works too. Mobile browsers are not supported (BroadcastChannel between windows requires a desktop environment).

## Development

```sh
npm install
npm run dev    # dev server at http://localhost:5173
npm run build  # production build → dist/
npm run lint
npm run format
```

## Deployment

The build output in `dist/` is a fully static site — deploy it anywhere: GitHub Pages, Netlify, Vercel, or any static host.

For GitHub Pages with a repository sub-path, set `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```
