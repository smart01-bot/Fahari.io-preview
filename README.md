# Fahari.io — Light-mode interactive preview

An independent, **no-login**, static GitHub Pages demonstration of the Fahari.io frontend. This preview is a purpose-built product walkthrough; it is **not** the production Fahari frontend, has no privileged login, and makes **no backend, banking, TRA or tax-service requests**.

## Coverage

- Overview: illustrative KPIs, trend chart and sample activity.
- Upload Center: CSV / Excel / PDF / image metadata demonstration, without sending or reading files.
- Tax Returns: VAT, PAYE, SDL, WHT sample statuses and a **local-only** draft-to-submitted simulation.
- Reports: period filters, chart, sample reports and generation of local demo report records.
- Notifications: read state and filtering.
- Settings: demo business name, demo preference toggles, reset.
- Responsive light-mode desktop, tablet, and mobile screens, without any authentication.

## Data and security boundary

All financial figures, names, deadlines, documents, notifications, tax amounts, and actions are **fictional and/or archival sample values** originating from the UI prototype. The example period is explicitly labelled **2024 sample data**; nothing claims to reflect current deadlines or actual tax filing. A selected file contributes only its name/type/size to the local UI; its bytes are never read or uploaded. No customer IDs, credentials, access tokens or real records are included.

## Run

Open `index.html` locally or serve this directory as a static website. There are **no npm dependencies**. For local preview:

```sh
python3 -m http.server 8080
```

Visit `http://localhost:8080`.

## GitHub Pages

Create a public repository named `fahari-preview`; upload these root-level files and the `tests/` directory. In **Settings → Pages**, choose **Deploy from a branch → main → / (root)**. The expected URL is `https://smart01-bot.github.io/fahari-preview/` once Pages is enabled and deployed.

## Verification

```sh
node tests/preview.test.cjs
```

## Source reference

Adapted as a **light-mode standalone demonstration** after inspecting the original [`smart01-bot/fahari-frontend`](https://github.com/smart01-bot/fahari-frontend), branch `main`, commit `63328327c77d0aae0e28a98e0b81d8876cb7bfd6`. The source includes mock authentication and an API pointing to `127.0.0.1:8000`; this preview intentionally includes neither.
