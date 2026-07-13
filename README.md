# Nanyuki Holiday Home — website

A multi-page static site (HTML/CSS/JS, no build step) for **Beben Design**.
White background, black ink, grey secondary. Display type **Cormorant Garamond**,
body/UI **Inter**. Smooth scroll, staggered scroll-reveal, mobile hamburger nav,
Formspree enquiries, WhatsApp, Google Maps embed, and SEO/schema baked in.

---

## Structure

```
/
├── index.html          Home — hero, intro, amenities teaser, attractions, reviews, CTA
├── about.html          About — story, rates, how to book, house rules
├── gallery.html        Photo gallery (lightbox)
├── amenities.html      Full amenities grid
├── attractions.html    Nearby places + getting here
├── contact.html        Enquiry form + contact + map + FAQ
├── 404.html            Custom not-found page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── css/styles.css  All styling + tokens + responsive + reduced-motion
    ├── js/main.js      Nav, reveal, lightbox, Formspree submit
    └── img/            Placeholder images (SVG) + OG cover + icons
```

Header and footer markup is repeated in each page (static site, no includes) — if
you change a nav link or footer detail, update it in **every** `.html` file.

---

## Deploy to GitHub Pages

1. Create a repo and push these files to the root of the `main` branch.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main`, Folder = `/ (root)`. Save.
3. Site goes live at `https://<username>.github.io/<repo>/` in a minute or two.
4. All links are **relative**, so it works from that sub-path with no changes.

### Custom domain (when it's sorted)
1. Add a file named `CNAME` at the repo root containing just the domain, e.g. `nanyukiholidayhome.co.ke`.
2. At the registrar, point DNS at GitHub Pages (four A records for the apex, or a
   CNAME record for `www`). Then set the domain under Settings → Pages and tick
   **Enforce HTTPS**. DNS can take a few hours — do this early.

---

## Before you go live — replace the placeholders

Search-and-replace across all files:

| Placeholder | Replace with |
|---|---|
| `REPLACE-WITH-DOMAIN` | the live domain (canonical, Open Graph, sitemap, robots, schema) |
| `your-form-id` in `contact.html` | your Formspree form ID |
| `000000000000` | the WhatsApp number in full international format, **no + or spaces** (e.g. `254712345678`) |
| `hello@example.com` | the real enquiry email |
| `+254 000 000 000` | the display phone number |
| `+254-000-000-000` (schema, index) | the real phone |

Then swap the **real content**:

- **Photos** — replace every file in `assets/img/` (the `g-*`, `about-*`, `hero`,
  `attr-*` placeholders are **labelled with the shot they represent**, so they
  double as a shot list for the photographer). Use optimised **WebP/JPG**, keep the
  filenames or update the `src`s, and set a meaningful `alt` on each.
- **OG cover** — replace `assets/img/og-cover.jpg` with a real 1200×630 photo
  (JPG/PNG — social scrapers don't render SVG). Once the domain is set, the
  `og:image` URLs must be **absolute** (they already point at `REPLACE-WITH-DOMAIN`).
- **Facts** — bedroom/bath counts, "sleeps", check-in/out, minimum stay (placeholders in `index.html` and `about.html`).
- **Reviews** — swap the placeholder testimonials for real, attributed Airbnb reviews.
- **Distances** — attraction drive times on `attractions.html` are marked "verify".
- **Copy** — the written content is placeholder-quality; drop in the Phase One copy when it's ready.

---

## Formspree (enquiry form)

1. Sign up at formspree.io (free tier), create a form, copy its ID.
2. In `contact.html`, set `action="https://formspree.io/f/<your-id>"`.
3. Submissions email you and are stored in the Formspree dashboard. The form posts
   via AJAX (no page reload) and shows inline success/error. A honeypot field blocks
   basic spam. Until the ID is set, the form shows a "not connected yet" notice.

### Attribution (important — no analytics on this site)
The **"How did you hear about us?"** field is the *only* thing tying an enquiry to a
marketing channel, which the 10% commission depends on. To make it reliable, tag the
links you post from Instagram / TikTok / Facebook with UTM parameters, e.g.
`https://REPLACE-WITH-DOMAIN/?utm_source=instagram&utm_medium=social`, and keep an eye
on the source dropdown in submissions.

---

## Notes

- **Accessibility floor**: keyboard focus is visible, secondary grey passes AA
  contrast on white, motion respects `prefers-reduced-motion`, images have alt text,
  the form is labelled. Keep new content to that bar.
- **Google Maps**: the embed on `contact.html` uses the pin you provided. To change
  it, use *Share → Embed a map* in Google Maps and paste the new `src`.
- **Phase Three (booking portal)** slots in on top of the existing enquiry form when
  you're ready — availability calendar, structured booking request, confirmation flow.
