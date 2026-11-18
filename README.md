# ✡ Hanukkah Twister

The fundraiser store for the **Hanukkah Twister** — six nested, twisted star rings that corkscrew out into a spinning tower and twist back down flat.

A static website (plain HTML, CSS and JavaScript, no build step) with:

- A Hanukkah-themed home page with an animated flat ↔ tower product view
- A "What it does" section explaining the toy
- Color picker, quantity and **Add to cart**
- A cart drawer (saved in the visitor's browser)
- A **Checkout** form (name, email, pickup or delivery, gift note)
- A menorah that lights a candle for every Twister in the cart 🕎

## Set up your fundraiser

Everything you need to change is in **`config.js`**:

| Setting | What it does |
|---|---|
| `price` | Price per Twister (default `$15`) |
| `cause` | A sentence about what the money supports |
| `colors` | The color options you're printing |
| `formEndpoint` | **Recommended.** A free [Formspree](https://formspree.io) form URL — every order is emailed to you |
| `paymentLink` | A Stripe Payment Link / PayPal / Venmo link buyers are sent to after ordering |
| `orderEmail` | Fallback: opens the buyer's email app with the order filled in |
| `payInstructions` | Text shown when there's no payment link |

> ⚠️ Until you set `formEndpoint` or `orderEmail`, orders are **not sent anywhere** — the checkout only shows a confirmation screen.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Put it online (GitHub Pages)

Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root → Save**. The site will appear at `https://<your-username>.github.io/Hanukkah-Twister/`.

## Files

```
index.html          page structure
styles.css          Hanukkah theme
app.js              cart, checkout, animations
config.js           your store settings
images/             product photos (flat + extended)
```

Chag Urim Sameach! 🕎
