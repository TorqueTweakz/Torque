# TORQUE (beta)

Windows performance suite for gamers. This repository hosts the project website (GitHub Pages) and the current beta download.

## Site structure

Plain static HTML, no build step.

| File | Purpose |
|---|---|
| `index.html` | Home |
| `features.html`, `tweaks.html` | Features and the full tweak reference |
| `security.html` | Security and transparency, how to verify the download |
| `download.html` | Download, checksum, installation guide |
| `faq.html`, `changelog.html`, `privacy.html` | Support and legal |
| `community.html` | Discord and support |
| `assets/style.css`, `assets/site.js` | Shared styles and scripts |

## Setup

- **Discord link:** set `DISCORD_INVITE` at the top of `assets/site.js`. Every Discord button reads it. While empty, they point to the Community page.
- **New release:** replace the zip in `downloads/`, then update the file name and SHA-256 in `download.html` and `security.html` (`sha256sum downloads/<file>.zip`).
