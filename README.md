# Nanyuki Country Home — website

A multi-page static site (HTML/CSS/JS, no build step) for **Beben Design**, live at
**https://nanyukicountryhome.com**. White background, black ink, grey secondary.
Display type **Cormorant Garamond**, body/UI **Inter**. Smooth scroll, staggered
scroll-reveal, mobile hamburger nav, Formspree enquiries, WhatsApp, Google Maps
embed, and SEO/schema baked in.

The house sleeps **up to 16** across 7 bedrooms and 7 bathrooms, let as a whole
house only.

---

## Structure

```
docs/                   (the published site root — GitHub Pages serves from here)
├── index.html          Home — hero, intro, amenities teaser, attractions, reviews, CTA
├── about.html          About — story, rates, how to book, house rules
├── gallery.html        Photo gallery (lightbox)
├── amenities.html      Full amenities grid
├── attractions.html    Nearby places + getting here
├── contact.html        Enquiry form + contact + map + FAQ
├── privacy.html        Privacy policy (Kenya, Data Protection Act 2019)
├── 404.html            Custom not-found page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── css/styles.css  All styling + tokens + responsive + reduced-motion
    ├── js/main.js      Nav, reveal, lightbox, Formspree submit
    └── img/            Property photography (AVIF) + attraction shots + OG cover + icons
```

Header and footer markup is repeated in each page (static site, no includes) — if
you change a nav link or footer detail, update it in **every** `.html` file.

---

## Deploy

**A push to `main` does not update the live site.** GitHub Pages serves `/docs` at
`https://luishowin.github.io/nanyuki-country-home/`, and that does follow `main`.
The apex domain **https://nanyukicountryhome.com** is served by a separate
**Cloudflare Worker** holding its own copy of the assets, and nothing in this repo
deploys it — there is no `wrangler` config and no `.github/workflows`. Redeploy the
Worker by hand after pushing, or connect Workers Builds to this repo so the two
stay in step. Skipping it is how the site sat on the pre-rebrand build for a while.

Canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt` and the JSON-LD all
carry the absolute domain — if the domain ever changes, search-and-replace
`nanyukicountryhome.com` across `docs/`.

The `github.io` URL serves the same pages, so the site exists at two hostnames.
The `rel="canonical"` tags all point at the apex, which is enough to keep the
duplicate out of the index.

### Redeploying the Worker
In the Cloudflare dashboard, open the Worker and look at its deployment list.
Each row shows one of two things, and they need different handling:

- **A branch and commit hash** — the Worker is connected to this repo through
  Workers Builds. *New deployment* rebuilds from the latest commit; check the
  commit it offers is the one you just pushed.
- **"Direct upload"**, or no Git information at all — the Worker was uploaded by
  hand and will never see a `git push`. *New deployment* asks you for files.
  Connect the repo under **Settings → Builds** so this stops being manual.

Whichever route, **the site root is `docs/`, not the repo root**. Any build or
output directory setting has to say `docs`, or the deployment serves nothing.

Then confirm the deploy actually landed — the apex, not `github.io`:

```bash
curl -s https://nanyukicountryhome.com/sitemap.xml | grep -c image:loc          # expect 23
curl -s -o /dev/null -w "%{http_code}\n" https://nanyukicountryhome.com/privacy # expect 200
curl -s https://nanyukicountryhome.com/ | grep -c REPLACE-WITH-DOMAIN            # expect 0
```

A stale apex fails these while the repo and `github.io` both look perfect, which
is exactly how the pre-rebrand build survived a push and a Search Console link.

### URL form — clean URLs, no `.html`
The Worker serves clean URLs: `/about.html` 308-redirects to `/about`, and
`/index.html` to `/`. So `rel="canonical"`, `og:url`, the `sitemap.xml` `<loc>`
values and the BreadcrumbList `item` URLs are all written **without** the `.html`
extension — a canonical that points at a redirect is a weak signal, and Search
Console reports such sitemap entries as "Page with redirect".

Internal `href="about.html"` links are left as they are and cost one 308 apiece,
which visitors never notice. GitHub Pages serves both forms without redirecting,
so the clean form is correct on either host.

**A new page therefore needs three things:** a clean-URL canonical and `og:url`, a
`<loc>` in `sitemap.xml`, and its photos added as `<image:image>` entries.

---

## Content notes

Real content is in: contact details, whole-house seasonal rates, drive times,
three attributed Google reviews, house policies, and the property photography.

Still worth improving:

- **Low-resolution attraction cards** — `attr-mweafalls.avif` (401×301) and
  `attr-equator.avif` (600×450) are well under the ~1600px the other cards use, so
  both look soft on high-DPI screens. Swap in higher-resolution originals if they
  turn up; the `src` is a one-line change in `index.html` / `attractions.html`.
- **Ol Pejeta and Solio** — the last two stock images (`attr-*.jpg`). Every other
  photo on the site is genuine.
- **Solio drive time** — the card says "Day trip from the house" because no figure
  was confirmed.
- **Paragraph spacing in `.split-copy`** — the stylesheet has `h2 + p` but no
  `p + p`, so consecutive paragraphs on the home and About pages sit flush with no
  gap. One line fixes it (`.split-copy p + p { margin-top: 1.1rem; }`); left alone
  as a design call, not a bug to fix silently.

---

## Search & local SEO

Done, and worth not undoing:

- **Absolute URLs everywhere.** Canonical, `og:url`, `og:image`, `sitemap.xml`,
  `robots.txt` and the JSON-LD all carry `https://nanyukicountryhome.com`. These
  shipped as `REPLACE-WITH-DOMAIN` placeholders for a while, which kept the site
  from being indexed under its own domain and left link previews blank.
- **Google Business Profile** renamed to *Nanyuki Country Home* and pointed at the
  site. Keep the name, address and phone identical to the footer — mismatched NAP
  is the usual cause of a local ranking drop.
- **Search Console** property connected; submit `sitemap.xml` again after any
  structural change, and check Coverage for the `github.io` duplicate above.
- **`sitemap.xml`** lists the seven indexable pages by clean URL, with `<lastmod>`
  and `<image:image>` entries for the 23 on-page property photos, so the
  photography can surface in Google Images. No `<priority>` or `<changefreq>` —
  Google ignores both. Only `<image:loc>` is used; `image:caption`, `image:title`,
  `image:license` and `image:geo_location` were deprecated in 2022. The two stock
  shots (`attr-olpejeta.jpg`, `attr-solio.jpg`) are deliberately left out, since
  they are not the property's own photography. `404.html` stays out too.
- **Structured data**: `LodgingBusiness` (`index.html`), `FAQPage`
  (`contact.html`) and `BreadcrumbList` on every inner page. `sameAs` links
  Instagram, TikTok and the Google Business Profile (via its CID).
  No `aggregateRating` — self-serving review markup on a LocalBusiness is not
  eligible for rich results and risks a manual action.
- **Core Web Vitals**: every `<img>` carries intrinsic `width`/`height`
  (no layout shift), below-the-fold images are lazy, and the hero is preloaded at
  `fetchpriority="high"`.

Not done:

- Bing Webmaster Tools.
- A branded Open Graph image. `assets/img/og-cover.jpg` is a 1200×630 living-room
  photo, correct but generic.

---

## Formspree (enquiry form)

Live form: `https://formspree.io/f/xqpklldy`, set on the `<form action>` in
`contact.html`. Submissions email you and are stored in the Formspree dashboard.

The form posts via `fetch` from `assets/js/main.js` (no page reload, inline
success/error, submit button disabled while sending). Required fields are checked
with `checkValidity()` before anything is sent, and a `_gotcha` honeypot blocks
basic spam. No Formspree SDK is loaded — deliberately, to keep the page free of
third-party JavaScript.

### Attribution (important — no analytics on this site)
The **"How did you hear about us?"** field is the *only* thing tying an enquiry to a
marketing channel, which the 10% commission depends on. To make it reliable, tag the
links you post from Instagram / TikTok with UTM parameters, e.g.
`https://nanyukicountryhome.com/?utm_source=instagram&utm_medium=social`, and keep an eye
on the source dropdown in submissions.

---

## Notes

- **Accessibility floor**: keyboard focus is visible, secondary grey passes AA
  contrast on white, motion respects `prefers-reduced-motion`, images have alt text,
  the form is labelled. Keep new content to that bar.
- **Google Maps**: the embed on `contact.html` uses the pin you provided. To change
  it, use *Share → Embed a map* in Google Maps and paste the new `src`.
- **Privacy policy**: `privacy.html` names Nanyuki Country Home as data controller
  under Kenya's Data Protection Act, 2019. If the enquiry form starts collecting new
  fields, or a new third-party service is added, update sections 2 and 4 to match.
- **Structured data**: the `LodgingBusiness` block in `index.html` mirrors the visible
  rates, capacity and amenities, and the `FAQPage` block in `contact.html` must match
  the visible FAQ word for word. Keep both in step when the copy changes.
- **Phase Three (booking portal)** slots in on top of the existing enquiry form when
  you're ready — availability calendar, structured booking request, confirmation flow.
