# Muhammad Qayyum — Amazon VA Expert Portfolio

Premium single-page portfolio built with **plain HTML, CSS & JavaScript** — no frameworks, no build step.

## Files
- `index.html` — structure & content
- `styles.css` — premium 6-color design system + responsive layout
- `script.js` — nav, scroll effects, 3D tilt, counters, form handling

## Run locally
Just open `index.html` in any browser. For form testing over a local server:
```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## ✏️ Things to edit

### 1. Formspree form IDs
Sign up at https://formspree.io, create two forms, then replace in `index.html`:
- Booking form → `https://formspree.io/f/YOUR_BOOKING_FORM_ID`
- Contact form → `https://formspree.io/f/YOUR_CONTACT_FORM_ID`

### 2. Social & contact links
In `index.html`, search for `YOUR_HANDLE` (LinkedIn, Facebook, Instagram, X) and update.
- WhatsApp: replace `920000000000` in `https://wa.me/920000000000` with your full number (country code, no `+`).
- Email: replace `hello@muhammadqayyum.com` everywhere.

### 3. Brand colors (optional)
All colors live as CSS variables at the top of `styles.css` under `:root`:
`--navy · --ivory · --gold · --orange · --sky · --charcoal`

## Features
- 6-color premium palette, consistent across the site
- 2D scroll-reveal + CSS 3D dashboard, tilt cards, magnetic CTAs, parallax
- Animated stat counters
- Fully responsive (320px → 1440px+), polished mobile menu
- Accessible: skip link, keyboard nav, `prefers-reduced-motion` support
- SEO: meta tags, Open Graph, Schema.org, semantic HTML
- Form validation + loading/success/error states
