/* ============================================================
   DIMENSIONE DOLCE — Shopify Buy SDK Integration
   Headless commerce: products on Shopify, frontend on Vercel
   ============================================================

   SETUP INSTRUCTIONS:
   1. Create a Shopify store and add your products
   2. Create a Storefront API access token:
      - Shopify Admin > Settings > Apps and sales channels > Develop apps
      - Create app > Configure Storefront API scopes:
        - unauthenticated_read_product_listings
        - unauthenticated_read_product_inventory
        - unauthenticated_write_checkouts
        - unauthenticated_read_checkouts
      - Install app > Copy Storefront access token
   3. Replace SHOPIFY_DOMAIN and STOREFRONT_TOKEN below
   4. Map your product handles in PRODUCT_MAP
   ============================================================ */

const SHOPIFY_CONFIG = {
  // TODO: Replace with your Shopify store values
  domain: 'dimensione-dolce.myshopify.com',
  storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN',
};

// Map page product IDs to Shopify product handles
const PRODUCT_MAP = {
  'pistacchio': 'panettone-al-pistacchio',
  'cioccolato': 'panettone-al-cioccolato',
  'crema': 'crema-spalmabile-cioccolato',
};

/* -------------------------------------------
   SHOPIFY CLIENT
   ------------------------------------------- */

let shopifyClient = null;
let checkout = null;

async function initShopify() {
  if (typeof ShopifyBuy === 'undefined') {
    console.warn('[Shopify] Buy SDK not loaded. Cart functionality disabled.');
    return false;
  }

  try {
    shopifyClient = ShopifyBuy.buildClient({
      domain: SHOPIFY_CONFIG.domain,
      storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
    });

    // Restore existing checkout or create new
    const savedCheckoutId = localStorage.getItem('dd_checkout_id');

    if (savedCheckoutId) {
      try {
        checkout = await shopifyClient.checkout.fetch(savedCheckoutId);
        if (checkout.completedAt) {
          checkout = await shopifyClient.checkout.create();
          localStorage.setItem('dd_checkout_id', checkout.id);
        }
      } catch {
        checkout = await shopifyClient.checkout.create();
        localStorage.setItem('dd_checkout_id', checkout.id);
      }
    } else {
      checkout = await shopifyClient.checkout.create();
      localStorage.setItem('dd_checkout_id', checkout.id);
    }

    updateCartUI();
    console.log('[Shopify] Client initialized, checkout ready.');
    return true;
  } catch (err) {
    console.error('[Shopify] Init failed:', err);
    return false;
  }
}

/* -------------------------------------------
   CART OPERATIONS
   ------------------------------------------- */

async function addToCart(productHandle, quantity = 1, variantIndex = 0) {
  if (!shopifyClient || !checkout) {
    console.warn('[Shopify] Not initialized');
    showAddedFeedback();
    return;
  }

  try {
    const product = await shopifyClient.product.fetchByHandle(productHandle);
    if (!product) {
      console.error('[Shopify] Product not found:', productHandle);
      return;
    }

    const variant = product.variants[variantIndex];
    const lineItems = [{ variantId: variant.id, quantity }];

    checkout = await shopifyClient.checkout.addLineItems(checkout.id, lineItems);
    localStorage.setItem('dd_checkout_id', checkout.id);

    updateCartUI();
    openCart();
    pulseCartIcon();
  } catch (err) {
    console.error('[Shopify] Add to cart failed:', err);
  }
}

async function updateCartItem(lineItemId, quantity) {
  if (!shopifyClient || !checkout) return;

  try {
    if (quantity <= 0) {
      checkout = await shopifyClient.checkout.removeLineItems(checkout.id, [lineItemId]);
    } else {
      checkout = await shopifyClient.checkout.updateLineItems(checkout.id, [
        { id: lineItemId, quantity },
      ]);
    }
    localStorage.setItem('dd_checkout_id', checkout.id);
    updateCartUI();
  } catch (err) {
    console.error('[Shopify] Update cart failed:', err);
  }
}

async function removeCartItem(lineItemId) {
  return updateCartItem(lineItemId, 0);
}

function goToCheckout() {
  if (checkout && checkout.webUrl) {
    window.location.href = checkout.webUrl;
  }
}

/* -------------------------------------------
   CART UI (Safe DOM construction, no innerHTML)
   ------------------------------------------- */

function getCartItemCount() {
  if (!checkout || !checkout.lineItems) return 0;
  return checkout.lineItems.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  if (!checkout) return '0,00';
  const amount = parseFloat(checkout.subtotalPrice?.amount || checkout.totalPrice?.amount || 0);
  return amount.toFixed(2).replace('.', ',');
}

function updateCartUI() {
  const count = getCartItemCount();

  const cartCountEl = document.querySelector('.header__cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle('has-items', count > 0);
  }

  renderCartItems();
}

function createEl(tag, className, textContent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
}

function renderCartItems() {
  const itemsContainer = document.querySelector('.cart-drawer__items');
  const subtotalPrice = document.querySelector('.cart-drawer__subtotal-price');
  const countEl = document.querySelector('.cart-drawer__count');
  const checkoutBtn = document.querySelector('.cart-drawer__checkout');

  if (!itemsContainer) return;

  const count = getCartItemCount();

  if (countEl) countEl.textContent = count + ' ' + (count === 1 ? 'articolo' : 'articoli');
  if (subtotalPrice) subtotalPrice.textContent = '\u20AC' + getCartSubtotal();
  if (checkoutBtn) checkoutBtn.disabled = count === 0;

  // Clear existing items
  itemsContainer.textContent = '';

  if (!checkout || !checkout.lineItems || checkout.lineItems.length === 0) {
    const emptyDiv = createEl('div', 'cart-drawer__empty');

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'cart-drawer__empty-icon');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', 'currentColor');
    iconSvg.setAttribute('stroke-width', '1.5');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z');
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '3'); line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '21'); line1.setAttribute('y2', '6');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M16 10a4 4 0 01-8 0');
    iconSvg.append(path1, line1, path2);

    emptyDiv.appendChild(iconSvg);
    emptyDiv.appendChild(createEl('p', 'cart-drawer__empty-text', 'Il carrello \u00E8 vuoto'));
    emptyDiv.appendChild(createEl('p', 'cart-drawer__empty-sub', 'Scopri i nostri prodotti'));
    itemsContainer.appendChild(emptyDiv);
    return;
  }

  checkout.lineItems.forEach(item => {
    const row = createEl('div', 'cart-item');
    row.dataset.lineId = item.id;

    // Image
    const imgWrap = createEl('div', 'cart-item__image');
    if (item.variant?.image) {
      const img = document.createElement('img');
      img.src = item.variant.image.src;
      img.alt = item.title;
      imgWrap.appendChild(img);
    }
    row.appendChild(imgWrap);

    // Info
    const info = createEl('div', 'cart-item__info');
    info.appendChild(createEl('span', 'cart-item__name', item.title));
    const varTitle = item.variant?.title;
    if (varTitle && varTitle !== 'Default Title') {
      info.appendChild(createEl('span', 'cart-item__variant', varTitle));
    }
    const priceAmount = parseFloat(item.variant?.price?.amount || 0).toFixed(2).replace('.', ',');
    info.appendChild(createEl('span', 'cart-item__price', '\u20AC' + priceAmount));

    // Quantity controls
    const qtyDiv = createEl('div', 'cart-item__qty');
    const decBtn = createEl('button', 'cart-item__qty-btn', '\u2212');
    decBtn.addEventListener('click', () => updateCartItem(item.id, item.quantity - 1));
    const qtyVal = createEl('span', 'cart-item__qty-val', String(item.quantity));
    const incBtn = createEl('button', 'cart-item__qty-btn', '+');
    incBtn.addEventListener('click', () => updateCartItem(item.id, item.quantity + 1));
    qtyDiv.append(decBtn, qtyVal, incBtn);
    info.appendChild(qtyDiv);

    row.appendChild(info);

    // Remove
    const removeBtn = createEl('button', 'cart-item__remove', 'RIMUOVI');
    removeBtn.addEventListener('click', () => removeCartItem(item.id));
    row.appendChild(removeBtn);

    itemsContainer.appendChild(row);
  });
}

/* -------------------------------------------
   CART DRAWER TOGGLE
   ------------------------------------------- */

function openCart() {
  document.querySelector('.cart-drawer')?.classList.add('is-open');
  document.querySelector('.cart-overlay')?.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.querySelector('.cart-drawer')?.classList.remove('is-open');
  document.querySelector('.cart-overlay')?.classList.remove('is-visible');
  document.body.style.overflow = '';
}

function pulseCartIcon() {
  const countEl = document.querySelector('.header__cart-count');
  if (countEl) {
    countEl.classList.remove('pulse');
    void countEl.offsetWidth;
    countEl.classList.add('pulse');
  }
}

function showAddedFeedback() {
  pulseCartIcon();
}

/* -------------------------------------------
   INIT ON DOM READY
   ------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Cart icon click
  document.querySelector('.header__cart')?.addEventListener('click', openCart);

  // Cart close
  document.querySelector('.cart-drawer__close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.querySelector('.cart-drawer__continue')?.addEventListener('click', closeCart);

  // Checkout button
  document.querySelector('.cart-drawer__checkout')?.addEventListener('click', goToCheckout);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // Wire up "AGGIUNGI AL CARRELLO" buttons on PDP pages
  document.querySelectorAll('.pdp__cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = btn.dataset.shopifyHandle || detectProductHandle();
      const variantIndex = getSelectedVariantIndex();
      if (handle) {
        addToCart(handle, 1, variantIndex);
      } else {
        openCart();
      }
    });
  });

  // Init Shopify (async, non-blocking)
  initShopify();
});

/* -------------------------------------------
   HELPERS
   ------------------------------------------- */

function detectProductHandle() {
  const path = window.location.pathname;
  if (path.includes('product-pistacchio')) return PRODUCT_MAP.pistacchio;
  if (path.includes('product-cioccolato')) return PRODUCT_MAP.cioccolato;
  if (path.includes('product-crema')) return PRODUCT_MAP.crema;
  return null;
}

function getSelectedVariantIndex() {
  const checked = document.querySelector('.pdp__weight-option:checked');
  if (!checked) return 0;
  const options = document.querySelectorAll('.pdp__weight-option');
  return Array.from(options).indexOf(checked);
}
