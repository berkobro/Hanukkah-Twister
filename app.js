(() => {
  const CFG = window.STORE_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- storage (safe) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // ---------- starry sky ----------
  const sky = $("#sky"), sctx = sky.getContext("2d");
  let stars = [];
  function sizeSky() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    sky.width = innerWidth * dpr; sky.height = innerHeight * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(innerWidth * innerHeight / 9000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.4 + .3, p: Math.random() * Math.PI * 2, s: Math.random() * .02 + .005,
      gold: Math.random() < .12,
    }));
  }
  function drawSky() {
    sctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const st of stars) {
      st.p += st.s;
      sctx.globalAlpha = .35 + .65 * (Math.sin(st.p) * .5 + .5);
      sctx.fillStyle = st.gold ? "#f6c445" : "#dfeaff";
      sctx.beginPath(); sctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); sctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(drawSky);
  }
  sizeSky(); drawSky();
  addEventListener("resize", () => { sizeSky(); if (reduceMotion) drawSky(); });

  // ---------- hero flat / tower ----------
  const stack = $("#photoStack");
  const toggles = $$(".toggle-btn");
  let pose = "flat", autoTimer = null;
  function setPose(p) {
    pose = p;
    stack.classList.toggle("tower", p === "tower");
    toggles.forEach(b => b.classList.toggle("is-on", b.dataset.pose === p));
  }
  function startAuto() {
    if (reduceMotion) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setPose(pose === "flat" ? "tower" : "flat"), 3200);
  }
  toggles.forEach(b => b.addEventListener("click", () => { setPose(b.dataset.pose); startAuto(); }));
  $("#heroSpin").addEventListener("click", e => {
    setPose(pose === "flat" ? "tower" : "flat"); startAuto();
    stack.classList.remove("wiggle"); void stack.offsetWidth; stack.classList.add("wiggle");
    gelt(e.clientX, e.clientY, 10);
  });
  startAuto();

  $$("[data-scroll]").forEach(b => b.addEventListener("click", () => $(b.dataset.scroll).scrollIntoView({ behavior: "smooth" })));

  // ---------- prices & cause ----------
  $$(".price-tag").forEach(el => el.textContent = money(CFG.price));
  if (CFG.cause) $("#causeText").textContent = CFG.cause + " Each Hanukkah Twister in your cart lights one candle — fill all eight!";

  // ---------- product options ----------
  const productImg = $("#productImg");
  let color = CFG.colors[0], qty = 1;
  const swWrap = $("#swatches");
  CFG.colors.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "swatch"; b.style.background = c.dot;
    b.setAttribute("aria-label", c.name); b.title = c.name;
    b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      color = c;
      $$(".swatch", swWrap).forEach(s => s.setAttribute("aria-pressed", s === b));
      showColor();
      productImg.classList.toggle("spin");
    });
    swWrap.appendChild(b);
  });
  function showColor() {
    productImg.style.filter = (color.filter === "none" ? "" : color.filter + " ") + "drop-shadow(0 20px 26px rgba(0,0,0,.45))";
    $("#swatchName").textContent = color.name;
  }
  showColor();
  const qtyOut = $("#qty");
  $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); qtyOut.textContent = qty; });
  $("#qtyPlus").addEventListener("click", () => { qty = Math.min(50, qty + 1); qtyOut.textContent = qty; });

  // ---------- cart ----------
  let cart = store.get("ht-cart", []).filter(l => CFG.colors.some(c => c.id === l.id));
  const colorById = id => CFG.colors.find(c => c.id === id);
  const count = () => cart.reduce((n, l) => n + l.qty, 0);
  const total = () => count() * CFG.price;

  function save() { store.set("ht-cart", cart); render(); }
  function add(id, n) {
    const line = cart.find(l => l.id === id);
    if (line) line.qty = Math.min(99, line.qty + n); else cart.push({ id, qty: n });
    save();
    const cc = $("#cartCount"); cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
  }

  $("#addToCart").addEventListener("click", e => {
    add(color.id, qty);
    toast(`Added ${qty} × ${color.name} Twister${qty > 1 ? "s" : ""} 🕎`);
    gelt(e.clientX, e.clientY, 14);
    qty = 1; qtyOut.textContent = 1;
  });

  function render() {
    $("#cartCount").textContent = count();
    $("#cartTotal").textContent = money(total());
    const body = $("#cartItems");
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><span class="big">✡</span><p>Your cart is empty.<br>Time to get twisting!</p></div>`;
    } else {
      body.innerHTML = "";
      cart.forEach(l => {
        const c = colorById(l.id);
        const row = document.createElement("div");
        row.className = "line";
        row.innerHTML = `
          <img src="images/twister-flat.png" alt="" style="filter:${c.filter}">
          <div>
            <h4>Hanukkah Twister</h4>
            <div class="meta">${c.name} · ${money(CFG.price)}</div>
            <div class="qty" role="group" aria-label="Quantity for ${c.name}">
              <button type="button" data-act="dec" aria-label="Decrease">−</button>
              <output>${l.qty}</output>
              <button type="button" data-act="inc" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="right"><b>${money(l.qty * CFG.price)}</b><br><button type="button" class="remove" data-act="rm">Remove</button></div>`;
        row.addEventListener("click", e => {
          const act = e.target.dataset.act; if (!act) return;
          if (act === "inc") l.qty = Math.min(99, l.qty + 1);
          if (act === "dec") l.qty -= 1;
          if (act === "rm" || l.qty < 1) cart = cart.filter(x => x !== l);
          save();
        });
        body.appendChild(row);
      });
    }
    $("#goCheckout").disabled = !cart.length;
    $("#goCheckout").style.opacity = cart.length ? 1 : .5;
    renderMenorah();
  }

  // ---------- drawer ----------
  const drawer = $("#cartDrawer"), overlay = $("#overlay");
  function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; $("#closeCart").focus(); }
  function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  // ---------- menorah ----------
  const menorah = $("#menorah");
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("div");
    b.className = "branch" + (i === 4 ? " shamash" : "");
    b.innerHTML = `<div class="flame"></div><div class="candle"></div><div class="cup"></div>`;
    menorah.appendChild(b);
  }
  let lastLit = -1;
  function renderMenorah() {
    const n = Math.min(8, count());
    const branches = $$(".branch", menorah);
    // shamash lights first, then candles fill in from right to left like the real thing
    branches[4].classList.toggle("lit", n > 0);
    const order = [8, 7, 6, 5, 3, 2, 1, 0];
    order.forEach((idx, k) => branches[idx].classList.toggle("lit", k < n));
    const cap = $("#menorahCaption");
    if (n === 0) cap.textContent = "Add a Twister to light the shamash 🕯️";
    else if (n < 8) cap.textContent = `${n} of 8 candles lit — ${8 - n} to go!`;
    else cap.textContent = "The whole menorah is glowing! Chag sameach! ✨";
    if (n === 8 && lastLit !== 8 && lastLit !== -1) {
      const r = menorah.getBoundingClientRect();
      gelt(r.left + r.width / 2, r.top + 40, 30);
    }
    lastLit = n;
  }

  // ---------- checkout ----------
  const modal = $("#checkout"), form = $("#orderForm");
  $("#payNote").textContent = CFG.paymentLink ? "After placing your order you'll be taken to the payment page." : CFG.payInstructions;
  $("#goCheckout").addEventListener("click", () => {
    if (!cart.length) return;
    closeCart();
    $("#checkoutForm").hidden = false; $("#confirmation").hidden = true;
    $("#summaryItems").innerHTML = cart.map(l =>
      `<li><span>${l.qty} × ${colorById(l.id).name}</span><b>${money(l.qty * CFG.price)}</b></li>`).join("");
    $("#summaryTotal").textContent = money(total());
    modal.hidden = false;
    form.elements.name.focus();
  });
  const closeModal = () => { modal.hidden = true; };
  $("#closeCheckout").addEventListener("click", closeModal);
  $("#doneBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeCart(); } });

  form.addEventListener("change", () => {
    const delivery = form.elements.delivery.value === "delivery";
    $(".addr", form).hidden = !delivery;
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const f = form.elements, err = $("#formError");
    $$("input, textarea", form).forEach(i => i.classList.remove("bad"));
    const problems = [];
    if (!f.name.value.trim()) { problems.push("your name"); f.name.classList.add("bad"); }
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) { problems.push("a valid email"); f.email.classList.add("bad"); }
    if (f.delivery.value === "delivery" && !f.address.value.trim()) { problems.push("a delivery address"); f.address.classList.add("bad"); }
    if (problems.length) { err.textContent = "Please add " + problems.join(", ") + "."; return; }
    err.textContent = "";

    const orderNum = "HT-" + Date.now().toString(36).toUpperCase().slice(-6);
    const order = {
      order: orderNum,
      name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(),
      delivery: f.delivery.value, address: f.address.value.trim(), note: f.note.value.trim(),
      items: cart.map(l => `${l.qty} x ${colorById(l.id).name}`).join("; "),
      quantity: count(), total: money(total()),
    };

    const btn = $("#placeOrder");
    btn.disabled = true; btn.textContent = "Placing order…";
    try {
      if (CFG.formEndpoint) {
        const res = await fetch(CFG.formEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error("bad response");
      } else if (CFG.orderEmail) {
        const body = Object.entries(order).map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${CFG.orderEmail}?subject=${encodeURIComponent("Hanukkah Twister order " + orderNum)}&body=${encodeURIComponent(body)}`;
      } else {
        console.warn("Hanukkah Twister: no formEndpoint or orderEmail set in config.js — this order was not sent anywhere.", order);
      }
    } catch {
      err.textContent = "Hmm, we couldn't send your order. Please try again.";
      btn.disabled = false; btn.textContent = "Place order";
      return;
    }
    btn.disabled = false; btn.textContent = "Place order";

    $("#orderNum").textContent = orderNum;
    $("#confirmMsg").textContent = CFG.paymentLink
      ? `Total: ${order.total}. Opening the payment page now — please include your order number.`
      : `Total: ${order.total}. ${CFG.payInstructions}`;
    $("#checkoutForm").hidden = true; $("#confirmation").hidden = false;
    gelt(innerWidth / 2, innerHeight / 3, 40);
    cart = []; save(); form.reset(); $(".addr", form).hidden = true;
    if (CFG.paymentLink) setTimeout(() => window.open(CFG.paymentLink, "_blank", "noopener"), 900);
  });

  // ---------- fun bits ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  function gelt(x, y, n) {
    if (reduceMotion) return;
    const bits = ["🪙", "✡", "✨", "💙"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "gelt";
      s.textContent = bits[i % bits.length];
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--dx", (Math.random() * 360 - 180) + "px");
      s.style.setProperty("--dy", (Math.random() * 300 + 200) + "px");
      s.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
      s.style.setProperty("--dur", (1 + Math.random() * .9) + "s");
      document.body.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  render();
})();
