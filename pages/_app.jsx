import '../styles/globals.css';
import { useEffect } from 'react';

const CLIENT_ID = "9bdf04be-e12e-451f-a14f-ab35dbf02363";
const SUPABASE_URL = "https://ggsoyejwvywgevszwuqt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnc295ZWp3dnl3Z2V2c3p3dXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODM5MjYsImV4cCI6MjA5OTk1OTkyNn0.1_UGFCpLtMCaTQArgYyofD_UPZ_Wnll5oPaI83qNESg";

function supabaseFetch(path, init) {
  var headers = Object.assign(
    { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
    (init && init.headers) || {}
  );
  return fetch(SUPABASE_URL + path, Object.assign({}, init, { headers: headers }));
}

var BRAND_TTL = 5 * 60 * 1000;
var IMG_TTL = 50 * 60 * 1000;

function readCache(key, ttl) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return null;
    var entry = JSON.parse(raw);
    if (Date.now() - entry.ts > ttl) return null;
    return entry.data;
  } catch (e) { return null; }
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
}

// Signs a Storage object path and reveals the given <img> element, reading
// from the per-client signed-URL cache (50-min TTL, well within the 1-hour
// Supabase signed-URL expiry) before making a network call.
function signAndSetImageEl(path, img, onSuccess) {
  if (!img) return;
  var cacheKey = 'cp_img_' + CLIENT_ID;
  var cached = readCache(cacheKey, IMG_TTL) || {};
  if (cached[path]) {
    img.style.display = '';
    img.src = cached[path];
    if (onSuccess) onSuccess();
    return;
  }
  supabaseFetch('/storage/v1/object/sign/clients/' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: 3600 }),
  })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (result) {
      if (!result || !result.signedURL) return;
      var url = SUPABASE_URL + '/storage/v1' + result.signedURL;
      var updated = readCache(cacheKey, IMG_TTL) || {};
      updated[path] = url;
      writeCache(cacheKey, updated);
      img.style.display = '';
      img.src = url;
      if (onSuccess) onSuccess();
    })
    .catch(function () {});
}

// Thin wrapper for the common case of a static, already-in-the-DOM <img id>
// (logo, hero, gallery) — service cards are built at runtime and use
// signAndSetImageEl directly with the element reference they already have.
function signAndSetImage(path, imgId, onSuccess) {
  signAndSetImageEl(path, document.getElementById(imgId), onSuccess);
}

// Fixed platform icon set — matches agency-service's model.SocialPlatforms
// allowlist. Only these platform names can ever come back from clients_public.
var SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5"></path></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="4"></rect><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"></path></svg>'
};
var SOCIAL_LOCATIONS = ['footer', 'hero', 'about'];

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (!CLIENT_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    var brandCacheKey = 'cp_brand_' + CLIENT_ID;
    var cachedBrand = readCache(brandCacheKey, BRAND_TTL);
    Promise.resolve(cachedBrand
      ? cachedBrand
      : supabaseFetch('/rest/v1/clients_public?id=eq.' + CLIENT_ID + '&select=socials,services,location,hero_focal_desktop,hero_focal_mobile,reviews,menu,about_me')
          .then(function (res) { return res.ok ? res.json() : null; })
          .then(function (rows) {
            var d = rows && rows[0];
            if (d) writeCache(brandCacheKey, d);
            return d;
          })
    ).then(function (data) {
        if (!data) return;
        var root = document.documentElement.style;
        // Hero background focal point — set directly on the element (not
        // :root) since it's a single-element concern; safe to set whether
        // or not hero.png has been signed/revealed yet by the separate
        // fetch below, since this is just a CSS property, not tied to the
        // image actually having loaded.
        var heroImgEl = document.getElementById('hero-bg-image');
        if (heroImgEl) {
          if (data.hero_focal_desktop) heroImgEl.style.setProperty('--hero-focal-desktop', data.hero_focal_desktop);
          if (data.hero_focal_mobile) heroImgEl.style.setProperty('--hero-focal-mobile', data.hero_focal_mobile);
        }
        (data.socials || []).slice(0, 3).forEach(function (soc, idx) {
          var icon = SOCIAL_ICONS[soc.platform];
          if (!icon || !soc.url) return;
          SOCIAL_LOCATIONS.forEach(function (loc) {
            var el = document.getElementById('social-' + loc + '-' + (idx + 1));
            if (!el) return;
            el.href = soc.url;
            el.innerHTML = icon;
            el.style.display = '';
          });
        });

        // Services: the grid starts empty in the generated JSX (see
        // servicesSection in claude_service.go) — this builds every card
        // from data.services entirely at runtime, so the count on the page
        // always matches what the client has actually configured. Clones
        // Claude's own #service-card-template (see servicesSection in
        // claude_service.go) instead of building a generic card here, so
        // the live section keeps whatever design Claude gave this specific
        // page instead of falling back to one fixed look on every site.
        var servicesWrap = document.getElementById('services-section');
        var servicesGrid = document.getElementById('services-grid');
        var serviceTemplate = document.getElementById('service-card-template');
        if (servicesGrid && serviceTemplate) {
          (data.services || []).slice(0, 8).forEach(function (svc) {
            var card = serviceTemplate.cloneNode(true);
            card.removeAttribute('id');
            card.style.display = '';
            var titleEl = card.querySelector('[data-field="title"]');
            if (titleEl) titleEl.textContent = svc.title || '';
            var descEl = card.querySelector('[data-field="description"]');
            if (descEl) descEl.textContent = svc.description || '';
            var priceEl = card.querySelector('[data-field="price"]');
            if (priceEl) priceEl.textContent = svc.price || '';
            var imgWrap = card.querySelector('[data-field="image-wrap"]');
            var img = card.querySelector('[data-field="image"]');
            if (svc.image && imgWrap && img) {
              imgWrap.style.display = '';
              signAndSetImageEl(CLIENT_ID + '/' + svc.image, img);
            }
            servicesGrid.appendChild(card);
          });
          serviceTemplate.remove();
          if (servicesWrap && servicesGrid.children.length > 0) servicesWrap.style.display = '';
        }

        // Menu: two-level clone — data.menu items are grouped by their own
        // item.category into first-seen order, then one
        // #menu-category-template is cloned per category (capped at this
        // build's package tier: 5 categories) and, inside each of those
        // clones, one nested [data-role="menu-item-template"] is cloned per
        // item in that category (capped at 12 per category).
        var menuWrap = document.getElementById('menu-section');
        var menuCategoriesWrap = document.getElementById('menu-categories');
        var categoryTemplate = document.getElementById('menu-category-template');
        if (menuCategoriesWrap && categoryTemplate) {
          var maxCategories = 5, maxItemsPerCategory = 12;
          var byCategory = {};
          var categoryOrder = [];
          (data.menu || []).forEach(function (item) {
            var cat = (item.category || '').trim() || 'Menu';
            if (!byCategory[cat]) {
              if (categoryOrder.length >= maxCategories) return;
              byCategory[cat] = [];
              categoryOrder.push(cat);
            }
            if (byCategory[cat].length < maxItemsPerCategory) byCategory[cat].push(item);
          });
          categoryOrder.forEach(function (catName) {
            var catBlock = categoryTemplate.cloneNode(true);
            catBlock.removeAttribute('id');
            catBlock.style.display = '';
            var nameEl = catBlock.querySelector('[data-field="category-name"]');
            if (nameEl) nameEl.textContent = catName;
            var itemsWrap = catBlock.querySelector('[data-role="menu-category-items"]');
            var itemTemplate = catBlock.querySelector('[data-role="menu-item-template"]');
            if (itemsWrap && itemTemplate) {
              byCategory[catName].forEach(function (item) {
                var card = itemTemplate.cloneNode(true);
                card.style.display = '';
                var titleEl = card.querySelector('[data-field="title"]');
                if (titleEl) titleEl.textContent = item.title || '';
                var descEl = card.querySelector('[data-field="description"]');
                if (descEl) descEl.textContent = item.description || '';
                var priceEl = card.querySelector('[data-field="price"]');
                if (priceEl) priceEl.textContent = item.price || '';
                var imgWrap = card.querySelector('[data-field="image-wrap"]');
                var img = card.querySelector('[data-field="image"]');
                if (item.image && imgWrap && img) {
                  imgWrap.style.display = '';
                  signAndSetImageEl(CLIENT_ID + '/' + item.image, img);
                }
                itemsWrap.appendChild(card);
              });
              itemTemplate.remove();
            }
            menuCategoriesWrap.appendChild(catBlock);
          });
          categoryTemplate.remove();
          if (menuWrap && categoryOrder.length > 0) menuWrap.style.display = '';
        }

        // Reviews: same clone-the-template pattern as services above (see
        // reviewsSection in claude_service.go).
        var reviewsWrap = document.getElementById('reviews-section');
        var reviewsGrid = document.getElementById('reviews-grid');
        var reviewTemplate = document.getElementById('review-card-template');
        if (reviewsGrid && reviewTemplate) {
          (data.reviews || []).slice(0, 3).forEach(function (rev) {
            var card = reviewTemplate.cloneNode(true);
            card.removeAttribute('id');
            card.style.display = '';
            var ratingEl = card.querySelector('[data-field="rating"]');
            if (ratingEl) ratingEl.textContent = '★'.repeat(Math.max(0, Math.min(5, rev.rating || 0)));
            var textEl = card.querySelector('[data-field="text"]');
            if (textEl) textEl.textContent = rev.text || '';
            var authorEl = card.querySelector('[data-field="author"]');
            if (authorEl) authorEl.textContent = rev.author || '';
            reviewsGrid.appendChild(card);
          });
          reviewTemplate.remove();
          if (reviewsWrap && reviewsGrid.children.length > 0) reviewsWrap.style.display = '';
        }
        // Location & Hours (see locationSection in claude_service.go) —
        // reveal the section only if the client has configured any field.
        // The map/directions link is built from the business name (baked
        // into data-business-name at generation time) plus the address, so
        // it resolves to the actual business listing on Google Maps instead
        // of a bare coordinate pin.
        var loc = data.location || {};
        var anyLocationField = loc.address || loc.phone || loc.email || (loc.hours || []).length > 0;
        if (anyLocationField) {
          var section = document.getElementById('location-section');
          if (section) {
            section.style.display = '';
            if (loc.address) {
              var businessName = section.getAttribute('data-business-name') || '';
              var mapQuery = (businessName ? businessName + ', ' : '') + loc.address;
              var directionsURL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQuery);
              var mapEmbed = document.getElementById('location-map-embed');
              if (mapEmbed) { mapEmbed.src = 'https://www.google.com/maps?q=' + encodeURIComponent(mapQuery) + '&output=embed'; mapEmbed.style.display = ''; }
              var mapPlaceholder = document.getElementById('location-map-placeholder');
              if (mapPlaceholder) mapPlaceholder.style.display = 'none';
              var directionsBtn = document.getElementById('location-directions-btn');
              if (directionsBtn) { directionsBtn.href = directionsURL; directionsBtn.style.display = ''; }
              var addressEl = document.getElementById('location-address');
              if (addressEl) { addressEl.textContent = loc.address; addressEl.href = directionsURL; }
              var addressRow = document.getElementById('location-address-row');
              if (addressRow) addressRow.style.display = '';
            }
            if (loc.phone) {
              var phoneEl = document.getElementById('location-phone');
              if (phoneEl) { phoneEl.textContent = loc.phone; phoneEl.href = 'tel:' + loc.phone.replace(/[^0-9+]/g, ''); }
              var phoneRow = document.getElementById('location-phone-row');
              if (phoneRow) phoneRow.style.display = '';
            }
            if (loc.email) {
              var emailEl = document.getElementById('location-email');
              if (emailEl) { emailEl.textContent = loc.email; emailEl.href = 'mailto:' + loc.email; }
              var emailRow = document.getElementById('location-email-row');
              if (emailRow) emailRow.style.display = '';
            }
            (loc.hours || []).forEach(function (h) {
              var row = document.getElementById('location-hours-' + h.day);
              var value = document.getElementById('location-hours-' + h.day + '-value');
              if (!row || !value) return;
              value.textContent = h.closed ? 'Closed' : (h.open + ' – ' + h.close);
              row.style.display = '';
            });
          }
        }

        // About Me (see aboutSection in claude_service.go) — same
        // reveal-only-if-configured singleton pattern as Location above.
        var about = data.about_me || {};
        if (about.title || about.description) {
          var aboutEl = document.getElementById('about-section');
          if (aboutEl) {
            aboutEl.style.display = '';
            var aboutTitleEl = document.getElementById('about-title');
            if (aboutTitleEl) aboutTitleEl.textContent = about.title || '';
            var aboutDescEl = document.getElementById('about-description');
            if (aboutDescEl) aboutDescEl.textContent = about.description || '';
            (about.bullets || []).slice(0, 6).forEach(function (text, idx) {
              var bulletEl = document.getElementById('about-bullet-' + (idx + 1));
              if (!bulletEl) return;
              bulletEl.textContent = text;
              bulletEl.style.display = '';
            });
            if (about.image) {
              var aboutImgWrap = document.getElementById('about-image-wrap');
              var aboutImg = document.getElementById('about-image');
              if (aboutImgWrap && aboutImg) {
                aboutImgWrap.style.display = '';
                signAndSetImageEl(CLIENT_ID + '/' + about.image, aboutImg);
              }
            }
          }
        }
    }).catch(function () {});

    signAndSetImage(CLIENT_ID + '/logo.png', 'site-logo', function () {
      // The mockup scaffold's onError hides this img (display:none) and
      // reveals a text fallback the moment the static placeholder src
      // 404s, which happens on every generated site before this fetch
      // ever resolves. signAndSetImage undoes the img's hide; this undoes
      // the fallback text reveal.
      var fallback = document.getElementById('logo-fallback-text');
      if (fallback) fallback.classList.add('hidden');
    });

    signAndSetImage(CLIENT_ID + '/hero.png', 'hero-bg-image', function () {
      // Only reveal the overlay once the background photo actually loaded —
      // otherwise a client who never uploaded one would see a plain tint
      // over their hero for no reason.
      var overlay = document.getElementById('hero-bg-overlay');
      if (overlay) overlay.style.display = '';
    });

    var galleryWrap = document.getElementById('gallery-section');
    var galleryGrid = document.getElementById('gallery-grid');
    var galleryTemplate = document.getElementById('gallery-item-template');
    if (galleryGrid && galleryTemplate) {
      for (var gi = 1; gi <= 5; gi++) {
        (function (n) {
          var tile = galleryTemplate.cloneNode(true);
          tile.removeAttribute('id');
          tile.style.display = '';
          var img = tile.querySelector('[data-field="image"]');
          if (img) signAndSetImageEl(CLIENT_ID + '/gallery-' + n + '.png', img);
          galleryGrid.appendChild(tile);
        })(gi);
      }
      galleryTemplate.remove();
      if (galleryWrap) galleryWrap.style.display = '';
    }
  }, []);

  return <Component {...pageProps} />;
}
