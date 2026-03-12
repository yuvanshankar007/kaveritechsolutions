/* =======================================
   KAVERI SECURITY SOLUTIONS — APP.JS
   Product data, cart, search, modals
======================================= */

/* ===========================
   PRODUCT DATABASE
=========================== */
const PRODUCTS = [
  {
    id: 1,
    name: "4K CCTV Dome Camera System",
    category: "camera",
    categoryLabel: "CCTV Camera",
    price: 4999,
    oldPrice: 6500,
    image: "assets/cctv_camera.png",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 124,
    description: "Ultra-HD 4K dome camera with night vision up to 30m, IP67 weatherproof rating, and wide-angle 120° view. Includes 1TB HDD storage.",
    specs: [
      "4K Ultra HD Resolution (8MP)",
      "Night Vision up to 30 metres",
      "IP67 Weatherproof Rating",
      "Wide-angle 120° lens",
      "Motion detection alerts",
      "Free 1-year warranty"
    ]
  },
  {
    id: 2,
    name: "Wireless Security Camera",
    category: "camera",
    categoryLabel: "Wireless Camera",
    price: 2499,
    oldPrice: 3200,
    image: "assets/wireless_camera.png",
    badge: "New",
    badgeType: "new-badge",
    rating: 4.6,
    reviews: 87,
    description: "Smart WiFi security camera with 2K resolution, two-way audio, cloud storage, and remote monitoring via smartphone app.",
    specs: [
      "2K Full HD Resolution",
      "WiFi & Remote App Control",
      "Two-way Audio Communication",
      "Cloud & Local Storage",
      "AI Motion Detection",
      "Easy DIY Installation"
    ]
  },
  {
    id: 3,
    name: "Biometric Attendance Machine",
    category: "access",
    categoryLabel: "Access Control",
    price: 8999,
    oldPrice: 11000,
    image: "assets/biometric_machine.png",
    badge: "Popular",
    rating: 4.9,
    reviews: 210,
    description: "Enterprise-grade biometric attendance system with fingerprint + face recognition, 5000 user capacity, and automatic payroll integration.",
    specs: [
      "Fingerprint + Face Recognition",
      "5000 User Capacity",
      "Automatic Payroll Export",
      "3\" TFT Colour Display",
      "USB & LAN Connectivity",
      "Real-time Attendance Reports"
    ]
  },
  {
    id: 4,
    name: "Video Door Phone",
    category: "access",
    categoryLabel: "Access Control",
    price: 5499,
    oldPrice: 7000,
    image: "assets/video_door_phone.png",
    badge: null,
    rating: 4.7,
    reviews: 65,
    description: "7-inch colour TFT door phone with HD camera, multiple indoor monitors support, remote unlock, and call-forwarding to smartphone.",
    specs: [
      "7\" HD Colour TFT Screen",
      "720p Outdoor Camera",
      "Remote Unlock via App",
      "Call Forwarding to Phone",
      "Night Vision Support",
      "Supports Up to 4 Indoor Units"
    ]
  },
  {
    id: 5,
    name: "DVR / NVR Recorder",
    category: "recorder",
    categoryLabel: "Recorder",
    price: 6999,
    oldPrice: 8500,
    image: "assets/dvr_recorder.png",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 98,
    description: "16-channel H.265+ DVR/NVR with HDMI 4K output, supports up to 8TB HDD, remote access, and AI analytics.",
    specs: [
      "16 Channel H.265+ Support",
      "4K HDMI Output",
      "Up to 8TB HDD Support",
      "Remote Access via App",
      "AI Person & Vehicle Detection",
      "24/7 Continuous Recording"
    ]
  },
  {
    id: 6,
    name: "Motion Sensor Alarm",
    category: "alarm",
    categoryLabel: "Alarm System",
    price: 1299,
    oldPrice: 1800,
    image: "assets/motion_sensor.png",
    badge: "New",
    badgeType: "new-badge",
    rating: 4.5,
    reviews: 45,
    description: "PIR motion sensor alarm with 120° wide-angle detection, instant SMS & app alerts, 100dB siren, and solar-powered option.",
    specs: [
      "120° Detection Angle",
      "Instant SMS & App Alerts",
      "100dB Built-in Siren",
      "Solar + Battery Powered",
      "Up to 12m Detection Range",
      "Pet-immune Mode Available"
    ]
  }
];

/* ===========================
   GALLERY DATA
=========================== */
const GALLERY_ITEMS = [
  { img: "assets/cctv_camera.png", title: "CCTV Installation", span: false },
  { img: "assets/hero_background.png", title: "Security Command Centre", span: true },
  { img: "assets/biometric_machine.png", title: "Biometric Setup", span: false },
  { img: "assets/dvr_recorder.png", title: "DVR Room Setup", span: false },
  { img: "assets/wireless_camera.png", title: "Wireless Camera Install", span: false },
  { img: "assets/video_door_phone.png", title: "Door Phone Install", span: false },
];

/* ===========================
   CART STATE
=========================== */
let cart = JSON.parse(localStorage.getItem("kss_cart") || "[]");

function saveCart() { localStorage.setItem("kss_cart", JSON.stringify(cart)); }

function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

/* ===========================
   HELPERS
=========================== */
function formatPrice(p) { return "₹" + p.toLocaleString("en-IN"); }

function showToast(msg, icon = "fa-check-circle", color = "#10b981") {
  const t = document.getElementById("toast");
  t.innerHTML = `<i class="fas ${icon}" style="color:${color};font-size:1.1rem;"></i> ${msg}`;
  t.classList.remove("hidden", "fade-out");
  setTimeout(() => {
    t.classList.add("fade-out");
    setTimeout(() => t.classList.add("hidden"), 310);
  }, 2800);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let html = "";
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = full + half; i < 5; i++) html += '<i class="far fa-star"></i>';
  return html;
}

/* ===========================
   RENDER PRODUCTS
=========================== */
function renderProducts(filter = "all") {
  const grid = document.getElementById("productsGrid");
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = "";
  list.forEach((p, idx) => {
    const inCart = cart.find(c => c.id === p.id);
    const card = document.createElement("div");
    card.className = "product-card reveal";
    card.style.transitionDelay = `${idx * 0.07}s`;
    card.setAttribute("data-category", p.category);
    card.innerHTML = `
      <div class="product-img-wrap" onclick="openModal(${p.id})">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/security_products.png'">
        ${p.badge ? `<span class="product-badge ${p.badgeType || ''}">${p.badge}</span>` : ""}
        <div class="product-quick-view"><i class="fas fa-eye"></i> Quick View</div>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.categoryLabel}</div>
        <div class="star-rating">${renderStars(p.rating)} <span>(${p.reviews} reviews)</span></div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div>
            <del class="product-price-old">${formatPrice(p.oldPrice)}</del>
            <div class="product-price">${formatPrice(p.price)}</div>
          </div>
          <button class="add-cart-btn ${inCart ? 'added' : ''}" onclick="addToCart(${p.id}, event)" id="cartbtn-${p.id}">
            <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  observeReveal();
}

/* ===========================
   RENDER GALLERY
=========================== */
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  GALLERY_ITEMS.forEach((g, i) => {
    const item = document.createElement("div");
    item.className = `gallery-item reveal ${g.span ? "span-2" : ""}`;
    item.style.transitionDelay = `${i * 0.08}s`;
    item.innerHTML = `
      <img src="${g.img}" alt="${g.title}" loading="lazy" onerror="this.src='assets/security_products.png'">
      <div class="gallery-overlay"><i class="fas fa-expand-alt"></i></div>`;
    grid.appendChild(item);
  });
  observeReveal();
}

/* ===========================
   CART
=========================== */
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
    showToast(`+1 ${product.name} in cart`, "fa-cart-shopping");
  } else {
    cart.push({ id, name: product.name, price: product.price, image: product.image, qty: 1 });
    showToast(`${product.name} added to cart!`, "fa-cart-plus");
    // Update button styles
    const btn = document.getElementById(`cartbtn-${id}`);
    if (btn) {
      btn.classList.add("added");
      btn.innerHTML = `<i class="fas fa-check"></i> Added`;
    }
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const count = getCartCount();
  document.getElementById("cartBadge").textContent = count;
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>`;
    total.textContent = "₹0";
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/security_products.png'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove"><i class="fas fa-trash"></i></button>
    </div>`).join("");
  total.textContent = formatPrice(getCartTotal());
}

function openCart() {
  renderCartItems();
  document.getElementById("cartSidebar").classList.remove("hidden");
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.remove("hidden");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  setTimeout(() => {
    document.getElementById("cartSidebar").classList.add("hidden");
    document.getElementById("cartOverlay").classList.add("hidden");
  }, 350);
}

/* ===========================
   MODAL
=========================== */
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById("productModal");
  const content = document.getElementById("modalContent");
  content.innerHTML = `
    <div class="modal-inner">
      <div class="modal-img">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/security_products.png'">
      </div>
      <div class="modal-details">
        <div class="modal-cat">${p.categoryLabel}</div>
        <h2 class="modal-title">${p.name}</h2>
        <div class="star-rating" style="font-size:0.85rem">${renderStars(p.rating)} <span style="color:#94a3b8;">(${p.reviews} reviews)</span></div>
        <div>
          <del style="color:#4b5563;font-size:0.85rem;">${formatPrice(p.oldPrice)}</del>
          <div class="modal-price">${formatPrice(p.price)}</div>
        </div>
        <p class="modal-desc">${p.description}</p>
        <div class="modal-specs">
          ${p.specs.map(s => `<div class="modal-spec"><i class="fas fa-check-circle"></i> ${s}</div>`).join("")}
        </div>
        <div class="modal-actions">
          <button class="modal-add-btn" onclick="addToCart(${p.id}); closeModal();">
            <i class="fas fa-cart-plus"></i> Add to Cart — ${formatPrice(p.price)}
          </button>
        </div>
      </div>
    </div>`;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("productModal").classList.add("hidden");
  document.body.style.overflow = "";
}

/* ===========================
   SEARCH
=========================== */
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

function performSearch(query) {
  if (!query.trim()) { searchDropdown.classList.add("hidden"); return; }
  const results = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(query.toLowerCase())
  );
  if (results.length === 0) {
    searchDropdown.innerHTML = `<div class="sd-item" style="color:#4b5563;cursor:default;"><i class="fas fa-search"></i>No products found</div>`;
  } else {
    searchDropdown.innerHTML = results.map(p => `
      <div class="sd-item" onclick="openModal(${p.id}); searchDropdown.classList.add('hidden'); searchInput.value = '';">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
        <div>
          <div style="font-weight:600;font-size:0.85rem;color:#f1f5f9;">${p.name}</div>
          <div style="font-size:0.75rem;color:#3b82f6;">${formatPrice(p.price)}</div>
        </div>
      </div>`).join("");
  }
  searchDropdown.classList.remove("hidden");
}

searchInput.addEventListener("input", e => performSearch(e.target.value));
document.getElementById("searchBtn").addEventListener("click", () => performSearch(searchInput.value));
document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrapper")) searchDropdown.classList.add("hidden");
});

/* ===========================
   PRODUCT FILTER
=========================== */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

/* ===========================
   NAVBAR SCROLL & ACTIVE
=========================== */
const navbar = document.getElementById("navbar");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const curr = window.scrollY;
  navbar.classList.toggle("scrolled", curr > 60);
  // Active nav link
  const sections = document.querySelectorAll("section[id]");
  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    const bot = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle("active", curr >= top && curr < bot);
  });
  // Back to top
  document.getElementById("backToTop").classList.toggle("hidden", curr < 400);
  lastScroll = curr;
});

/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll(".nav-link").forEach(l => l.addEventListener("click", () => navLinks.classList.remove("open")));

/* ===========================
   SCROLL REVEAL
=========================== */
let revealObserver;
function observeReveal() {
  const elems = document.querySelectorAll(".reveal:not(.visible)");
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } });
    }, { threshold: 0.12 });
  }
  elems.forEach(el => revealObserver.observe(el));
}

/* ===========================
   CONTACT FORM
=========================== */
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("formName").value.trim();
  const email = document.getElementById("formEmail").value.trim();
  const msg = document.getElementById("formMessage").value.trim();
  const status = document.getElementById("formStatus");
  if (!name || !email || !msg) {
    status.className = "form-status error";
    status.textContent = "Please fill in all required fields.";
    status.classList.remove("hidden");
    return;
  }
  status.className = "form-status success";
  status.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, ${name}! We'll get back to you soon.`;
  status.classList.remove("hidden");
  this.reset();
  setTimeout(() => status.classList.add("hidden"), 5000);
});

/* ===========================
   BACK TO TOP
=========================== */
document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===========================
   MODAL / CART EVENTS
=========================== */
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("productModal").addEventListener("click", e => { if (e.target === e.currentTarget) closeModal(); });
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) { showToast("Your cart is empty!", "fa-cart-shopping", "#ef4444"); return; }
  showToast("Redirecting to checkout... We'll contact you shortly!", "fa-check-circle");
  setTimeout(() => {
    window.location.href = `mailto:vpraveenkumar2k6@gmail.com?subject=Order Enquiry&body=Hi, I would like to order products worth ${formatPrice(getCartTotal())}. Please get in touch!`;
  }, 1500);
});

/* ===========================
   KEYBOARD EVENTS
=========================== */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal(); closeCart(); }
});

/* ===========================
   PRELOADER
=========================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("fade-out");
    setTimeout(() => document.getElementById("preloader").remove(), 600);
  }, 1800);
});

/* ===========================
   INIT
=========================== */
(function init() {
  renderProducts();
  renderGallery();
  updateCartUI();

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    })
  );

  // Add reveal class to static sections
  document.querySelectorAll(".why-card, .about-feature, .contact-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.06}s`;
  });
  observeReveal();
})();
