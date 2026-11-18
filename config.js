// ===== Hanukkah Twister store settings =====
// Edit these values to set up your fundraiser. No other file needs to change.
window.STORE_CONFIG = {
  // Price per Twister, in dollars.
  price: 15,

  // One sentence about what the money goes toward (shown in the menorah section).
  // Leave "" to keep the default text.
  cause: "",

  // Color options shown in the shop. "dot" is the swatch color; "filter" tints the
  // product photo to preview that color. Remove any color you won't be printing.
  colors: [
    { id: "blue-white",  name: "Blue & White",  dot: "linear-gradient(135deg,#fff 50%,#1e6fd9 50%)", filter: "none" },
    { id: "gelt-gold",   name: "Gelt Gold",     dot: "linear-gradient(135deg,#fff3c4 50%,#d4a017 50%)", filter: "hue-rotate(186deg) saturate(1.3) brightness(1.05)" },
    { id: "royal-purple", name: "Royal Purple", dot: "linear-gradient(135deg,#fff 50%,#7b3fe4 50%)", filter: "hue-rotate(45deg) saturate(1.1)" },
    { id: "midnight",    name: "Midnight Silver", dot: "linear-gradient(135deg,#e3e7ee 50%,#33415c 50%)", filter: "saturate(0.35) brightness(0.9) contrast(1.15)" },
  ],

  // ---- Where orders go (pick one; the first one filled in is used) ----

  // 1) Formspree (free): make a form at https://formspree.io and paste its endpoint,
  //    e.g. "https://formspree.io/f/abcdwxyz". Orders arrive in your email.
  formEndpoint: "https://formspree.io/f/xvkarvpe",

  // 2) Email fallback: opens the buyer's email app with the order filled in.
  orderEmail: "",

  // ---- Payments (shown after the order is placed; use either or both) ----

  // PayPal: buyers pay with PayPal or a debit/credit card, for the exact cart total.
  // Get a Client ID at https://developer.paypal.com → Apps & Credentials → Live → Create App.
  // ("test" shows PayPal's practice sandbox — no real money.)
  paypalClientId: "",

  // Stripe Payment Link: Apple Pay, Google Pay and debit/credit cards.
  // In Stripe: Payment Links → New → product "Hanukkah Twister" at your price,
  // turn ON "Let customers adjust quantity", then paste the link here.
  stripePaymentLink: "",

  // Shown on the checkout screen when no payment option is set up.
  payInstructions: "We'll reach out to arrange payment and pickup. Cash, Venmo and Zelle welcome.",
};
