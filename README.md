# Stock Analyzer Pro

Fundamental & technical analysis tool for US stocks. Single-file HTML/JS PWA — no build step required.

⚠️ **Educational use only. Not financial advice.**

---

## 📁 What's in this package

```
index.html              # the entire app (HTML/CSS/JS in one file)
manifest.json            # PWA manifest (name, icons, colors)
sw.js                     # service worker (installability + app-shell caching)
favicon.ico
icons/
  icon-192.png            # standard app icon, 192×192
  icon-512.png            # standard app icon, 512×512
  icon-maskable-512.png    # Android adaptive icon (safe-zone inset), 512×512
  icon-180.png             # Apple touch icon
splash/
  splash-1080x1920.png    # portrait phone splash
  splash-1440x2560.png    # large portrait splash
  splash-1024x1024.png    # square splash / store hero art
```

All icons: minimalist geometric eagle, dark silhouette on solid yellow (`#FFC400`).

---

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repo (or use an existing one) and push **all files in this package**, keeping the folder structure exactly as-is (`icons/`, `splash/` must stay as subfolders next to `index.html`).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` (or whichever branch you pushed to) → folder `/ (root)`.
3. Wait 1–2 minutes. Your app will be live at:
   `https://<your-username>.github.io/<repo-name>/`
4. **Verify PWA installability**: open the URL on your phone in Chrome, you should see an "Add to Home Screen" / install prompt. If not, open DevTools → Application → Manifest and check for errors (usually a wrong icon path or scope mismatch).

### Updating after changes
Every time you push a new `index.html`, **bump `CACHE_NAME` in `sw.js`** (e.g. `stock-analyzer-pro-v1` → `-v2`). Without this, returning visitors' browsers will keep serving the old cached version indefinitely.

---

## 📱 Package for Google Play (via TWA / AppMint)

A PWA can't be uploaded to Google Play directly — it needs to be wrapped as a **Trusted Web Activity (TWA)**, which is a thin native Android shell that points at your live GitHub Pages URL.

### Using AppMint (your existing workflow)
1. Deploy to GitHub Pages **first** (above) — AppMint needs a live HTTPS URL, it doesn't accept raw files.
2. In AppMint, point it at your GitHub Pages URL.
3. Upload `icons/icon-512.png` as the app icon when AppMint asks for one (it needs its own upload — it does not read `manifest.json` automatically).
4. Upload one of the `splash/` images if AppMint has a separate splash-screen upload step.
5. **Known limitation (from prior sessions):** AppMint's WebView has file-picker restrictions — if any feature in the app relies on file upload/download through the native file picker, test that specifically inside the wrapped APK, not just in mobile Chrome, since behavior can differ.

### Play Store listing assets (separate from the app's own icons)
Google Play's *store listing* requires its own graphics, independent of the PWA icons above:
| Asset | Size | Notes |
|---|---|---|
| App icon (Play Store listing) | 512×512 PNG, 32-bit with alpha | Can reuse `icons/icon-512.png` |
| Feature graphic | 1024×500 PNG/JPG | ✅ Included: `store-listing/feature-graphic-1024x500.png` |
| Screenshots | At least 2, phone-sized | Take these from the running app |

### Digital Asset Links (required for TWA, no address bar)
For the wrapped app to open without a browser address bar, you need an `assetlinks.json` file proving you own both the app and the domain. AppMint typically generates the signing key and walks you through this — if it asks for a SHA-256 fingerprint, that comes from AppMint's build output, not from this package.

---

## 🔧 Local development

No build tools needed. Just serve the folder over HTTP (not `file://`, since the service worker and manifest require a proper origin):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 📊 Data sources

Finnhub, Twelve Data, FMP, Polygon, Yahoo Finance, Alpha Vantage, Stooq, plus optional premium sources (Tiingo, EODHD, Alpaca, Intrinio) if API keys are configured in Settings. All sources have automatic fallback — if one fails, the next is tried automatically.

Educational tool only. Verify all data independently before making any trading decision.
