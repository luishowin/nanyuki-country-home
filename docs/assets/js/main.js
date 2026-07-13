/* =========================================================================
   Nanyuki Holiday Home - main.js
   Header state · mobile nav · scroll reveal · lightbox · Formspree submit
   ========================================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: hairline + shadow after scroll -------------------------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav (hamburger overlay) ---------------------------------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
    // close when a nav link is tapped
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    // Escape closes
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) setNav(false);
    });
    // reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setNav(false);
    });
  }

  /* ---- Scroll reveal (staggered) --------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings that share a [data-stagger] parent
        var parent = el.closest("[data-stagger]");
        var delay = 0;
        if (parent) {
          var group = Array.prototype.slice.call(parent.querySelectorAll(".reveal"));
          delay = Math.min(group.indexOf(el), 8) * 90;
        }
        el.style.transitionDelay = delay + "ms";
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Lightbox (gallery) ---------------------------------------------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox] .tile"));
  if (tiles.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>' +
      '<p class="lightbox-cap"></p>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lightbox-cap");
    var idx = 0;
    var items = tiles.map(function (t) {
      var img = t.querySelector("img");
      return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
    });

    function show(i) {
      idx = (i + items.length) % items.length;
      lbImg.setAttribute("src", items[idx].src);
      lbImg.setAttribute("alt", items[idx].alt);
      lbCap.textContent = items[idx].alt;
    }
    function open(i) { show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }

    tiles.forEach(function (t, i) {
      t.addEventListener("click", function () { open(i); });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---- Formspree enquiry submit (AJAX, no page reload) ------------------ */
  var form = document.getElementById("enquiryForm");
  if (form) {
    var status = document.getElementById("formStatus");
    function setStatus(type, msg) {
      if (!status) return;
      status.className = "form-status show " + type;
      status.textContent = msg;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot: silently drop bots
      if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return;

      var action = form.getAttribute("action") || "";
      if (action.indexOf("your-form-id") !== -1 || action.indexOf("FORM_ID") !== -1) {
        setStatus("err", "Enquiry form isn’t connected yet. Add your Formspree form ID to go live. (Placeholder)");
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("ok", "Thank you, your enquiry is on its way. We’ll reply within 24 hours.");
          } else {
            return res.json().then(function (data) {
              var m = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(", ")
                                          : "Something went wrong. Please try WhatsApp or email instead.";
              setStatus("err", m);
            });
          }
        })
        .catch(function () {
          setStatus("err", "Network error. Please try again, or reach us on WhatsApp.");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
