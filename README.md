# A Little Place for My Love 💗

A cute, mobile-friendly romantic website with:
- A heartfelt love letter
- Tap-to-open reasons you love her
- A playable heart-catching mini-game
- A surprise message and floating hearts
- Optional little synthesized tune (only plays when tapped)
- PWA manifest and service worker for offline caching / iPhone Home Screen use

## 1. Make it yours (quick edits)

Open `index.html` in any text editor and edit the letter, reasons, and surprise message. Search for phrases like `my favourite human`, `your person`, and `my girl` to change the wording. The site intentionally uses affectionate defaults without requiring you to answer any questions.

To personalize the browser title, edit the `<title>` element near the top of `index.html`.

## 2. Upload to GitHub Pages

1. Sign in to GitHub and create a **new public repository** (for example `love-for-her`).
2. Unzip this project on your computer.
3. Open the repository on GitHub, choose **Add file → Upload files**.
4. Upload the *contents* of this folder (make sure `index.html` is at the repository root, not inside another nested folder).
5. Click **Commit changes**.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch **main** and folder **/(root)**, then click **Save**.
9. Wait a minute or two. GitHub will show the published URL in Settings → Pages. It usually looks like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## 3. Add it to her iPhone Home Screen

1. Open the published HTTPS website in **Safari** on her iPhone (not an in-app browser).
2. Tap **Share** (the square with the up arrow).
3. Scroll and tap **Add to Home Screen**.
4. Edit the name to something cute, like **My Love 💗**, then tap **Add**.

The website has a web app manifest, an Apple touch icon, and a service worker. GitHub Pages serves HTTPS, which enables the service worker. It opens in a standalone-style window when launched from the Home Screen. On iPhone, Safari's Add to Home Screen flow is the reliable way to install it.

## 4. Preview locally

You can double-click `index.html` to preview most features. For the service worker/PWA behaviour, run a local web server instead. If Python is installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- No API keys, database, accounts, or external backend are needed.
- The Google Fonts import is an optional online enhancement; fallback fonts are included.
- The optional tune is generated in the browser and does not autoplay.
- The mini-game works with touch and mouse.


## Latest update: layered collage + cat corner

- The memories area is now a fixed overlapping scrapbook collage; there is no “Add a memory” button or upload form.
- Replace sample art in `assets/` with your own images, keeping the same filenames, or update the corresponding `src` values in `index.html`.
- Recommended: use portrait images (roughly 4:5) and keep files reasonably small for fast loading on iPhone.
- Cat Corner includes a salute cat, cool cat, hug cat, and pink-hat cat; tapping a cat card shows a little playful message.
- The layered polaroids use CSS 3D depth, hover tilt, floating stickers, and responsive layouts.
