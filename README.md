# SEMITS Health V525 — Unified Privacy-First Web Edition

**Standalone preview** — new separate project, not an upgrade or modification of V522 or V1. Do not overwrite the live V1 GitHub Pages repository until you have reviewed and tested V525. V525 is **not independently security audited** and must **not yet be used for actual medical records**.

## Working functionality
- Responsive Safari/iPhone home-screen interface; installable PWA
- Local encrypted vault with AES-256-GCM and PBKDF2-SHA256 (600,000 iterations, 128-bit random salt, 96-bit random IV per save); encryption performed in the browser
- Passphrase required to unlock; encrypted vault persisted only in IndexedDB; no plaintext app data written to browser localStorage
- Vault lock button and 5-minute inactivity timer (or background lock timer)
- Manual food/macronutrient journal, gym/activity records, water logging, seven-day report, health reflections and simple profile
- Encrypted file attachment for PDF, PNG, JPEG or WEBP, up to 2 MB per file, with encrypted storage and on-demand local download
- Portable **encrypted** JSON backup and passphrase-verified restore (manual transfer only)
- Public app assets cached for offline use via service worker, not confidential vault contents

## NOT implemented / security boundaries
- No automatic AI food-photo recognition, metabolism/medical decision engine, local inference models, live research ingestion, or motivational video generation
- No cloud backend, end-to-end encrypted **automatic** sync, secure account registration, passkeys, account recovery, multi-device conflicts or managed device revocation
- No independent security review, penetration testing, clinical validation, regulatory assessment or server-side account security. Protect against malicious scripts or compromised devices remains necessary.
- Public GitHub Pages source can change, and browser-based encryption alone cannot guarantee safety against compromised page code, extensions, malicious devices, browser vulnerabilities or XSS.
- **Do not put private medical data in a GitHub repository, issue, commit, log, screenshot or Pages deployment.**
- Local IndexedDB storage is not a reliable only copy: Safari can delete site data, and different origins / Safari vs installed Home Screen context can have separate storage. Keep verified encrypted backups in trusted locations. Losing your passphrase makes data unrecoverable; there is no recovery key.
- Document downloads are **unencrypted** after local decryption; safeguard the downloaded files.
- Nothing in this prototype is medical advice or a medical device.

## Publish as a NEW repository using an iPhone, iPad or Mac
1. Download `SEMITS_Health_V525_Unified_Web.zip`; extract it using Files (iPhone) or Finder (Mac).
2. Visit <https://github.com/new> and create a NEW repository named `semits-health-v525` (public for GitHub Pages). Do **not** delete or replace `-semits-health-web` (your live V1 repository).
3. In the new repository choose **Add file → Upload files**. Select **all extracted files** (`index.html`, `app.js`, `styles.css`, icons, `sw.js`, `manifest.webmanifest`, `.nojekyll`, README). Do not upload the ZIP itself.
4. Commit files; choose **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
5. Your site should become `https://YOUR-USERNAME.github.io/semits-health-v525/`. Use the GitHub Pages **Visit site** link to verify it. Open in Safari, then **Share → Add to Home Screen**.
6. Try V525 using **dummy data only**. Test vault creation, lock/unlock, food and activity logs, and an encrypted backup/restore on a separate device.

## Technical notes
- Static HTML, CSS, vanilla JS; no external code, CDN, analytics, API calls, remote AI or tracking pixels.
- Crypto: Web Crypto `crypto.subtle` with PBKDF2 SHA-256 (600k rounds) deriving a non-exportable AES-GCM key; 16-byte salt; 12-byte fresh IV for every vault encryption; authenticated payload stored in IndexedDB; passphrase never persisted.
- Encrypted backup file contains the same ciphertext envelope; the filename and JSON envelope metadata are not secret. There is no plaintext backup option.
- A browser can sometimes retain sensitive material in memory or downloads; local encryption does not protect against code executing in the same page origin.
- Security hardening needed before production: externally reviewed threat model and code, CSP, dependency and deployment controls, hardening against XSS and code substitution, safer key handling, recovery and sync protocols, backup integrity/versioning, file upload sandboxing, device loss strategy, privacy and regulatory review, continuous monitoring.

## Preserved projects
- **V522**: no files or settings modified.
- **Live V1**: existing repo and demo unchanged; separate deployment path.

## V526 food camera development branch (not deployed)
- Adds a mobile camera/photo chooser with in-memory preview and clear-photo action to Food Intelligence.
- Photo does not leave the browser or persist in the encrypted vault; nutrition entry remains manual; AI recognition is NOT claimed.
- JPEG/PNG/WEBP up to 8 MB. Never use this experimental branch for actual private medical records.
- Branch: `development/v526-food-camera`; preserves `main` and all older baselines.

## V527 experimental intelligence branch (separate, not live)
- **Food AI**: explicit opt-in to the browser's built-in image-capable LanguageModel, only if supported. No remote AI service, no CDN model scripts, no photo upload. Unsupported browsers show an honest fallback. Image labels require manual validation and manual nutritional quantities.
- **Metabolism**: adult-only Mifflin-St Jeor BMR estimate, activity factor, optional illustrative energy adjustment for goals. Measurement inputs are encrypted with the existing V525 vault. These are estimates, not real metabolic-rate measurements or medical targets.
- **Motivational video**: 30-second canvas animation based on actually logged food and activity. Browser MediaRecorder may export WebM; Safari support varies. Not AI video generation, facial animation or synthetic exercise demonstrations.
- No health record, facial picture, or private data is sent to an external model. Browser-provided model APIs and export still require independent privacy/security verification.
- This branch is **not deployed**. Test with dummy data only. V525 main, V524, V522 and V1 remain untouched.

## V528 Universal Integrated Web Edition (experimental development)
- Separate branch `development/v528-universal`; all existing stable branches and live websites remain untouched.
- Encrypted universal profile preferences: preferred activity schedule, eating preference, activity days, session duration, personal priorities. These settings are stored in the existing V525 encrypted local vault, not an external server.
- Food-planning dashboard: summarizes today's logged calories, protein and food entries and gives a general goal-aligned food habit suggestion. No invented analysis, automatic food nutrient retrieval or individual clinical advice.
- Gym-planning dashboard: actual activity minutes, preferred routine and weekly exercise frequency; planned activity is never counted as completed.
- Unified daily report: combines actual recorded meals, exercise, water, seven-day exercise days and most recent mood, plus an achievable wellness focus. Missing records remain unknown rather than being assumed zero consumption.
- Retains earlier V527 conditional on-device food image recognition, adult predictive metabolic equation and local 30-second canvas motivational animation.
- No external AI inference, account signup, multi-device sync, medical diagnosis, clinical validation, synthetic selfie video or real 561-food research library in this branch.
- Static syntax checks only; browser/integration tests and a security assessment are still required. Use dummy data.
