# J.A.R.V.I.S. — Mobile PWA

## Fastest path to your phone (5 min, no live Claude yet)

1. Go to **https://app.netlify.com/drop**
2. Drag the whole `jarvis-pwa` folder onto the page
3. Netlify gives you a URL like `random-name.netlify.app`
4. Open that URL on your phone → Safari: **Share → Add to Home Screen**. Chrome (Android): menu → **Install app**
5. Launch it from your home screen — it opens fullscreen, no browser chrome

This works immediately in **local demo mode** — the mic and HUD are fully live, JARVIS just gives canned replies until you wire in step 2 below.

## Wiring in live AI replies — free, no card required (Gemini)

The included `api/chat.js` calls Google's **Gemini API**, which has a genuine free tier (no credit card, ~1,500 requests/day on the Flash model). Setup:

1. Go to **aistudio.google.com/apikey** → sign in with a Google account → **Create API key** (no billing needed)
2. Push this folder to a GitHub repo (or use the `vercel` CLI directly on the folder)
3. Import it at **vercel.com** → New Project
4. In Project Settings → Environment Variables, add `GEMINI_API_KEY` with the key from step 1
5. Deploy — you'll get a URL like `your-app.vercel.app`
6. In the JARVIS app, tap the ⚙ settings icon and set the endpoint to:
   `https://your-app.vercel.app/api/chat`

From then on, JARVIS speaks live Gemini responses — including reading the camera feed when it's active. Worth knowing: Google's free tier may use your inputs to improve their models, and it's rate-limited (fine for personal use, just don't hammer it in a tight loop).

*(Prefer Claude instead? The original Anthropic version of this proxy is straightforward to swap back in — just ask and I'll regenerate it.)*

## Notes

- **Fully voice-controlled — no mic or camera buttons.** Only the ⌨ keyboard icon remains, as a typing fallback.
- **Always listening, wake-word gated:**
  - Say **"don't listen"** or **"stop listening"** → JARVIS goes quiet and ignores everything except the wake word
  - Say **"JARVIS"** → wakes it back up to take commands
- **Say "camera" / "open camera"** → camera activates automatically (small preview appears top-right). Say **"close camera"** / **"turn off camera"** to stop it.
- **Everything JARVIS says is shown as an on-screen caption**, not just spoken — useful in noisy environments or silent mode.
- **"Show me a picture of X" / "visualize X" / "what does X look like"** generates and displays an image live via Pollinations.ai (free, no API key needed) — works even before you connect the Claude proxy.
- The service worker caches the app shell, so the HUD still loads offline; live replies and image generation need a connection.
- Everything (endpoint, voice choice) is stored in `localStorage` on your phone.
