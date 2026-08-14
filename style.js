(function(){
  "use strict";

  /* ---------------- DATA ---------------- */
  const CATEGORIES = [
    { id:'fruits',   name:'Fruits & Vegetables', emoji:'🍎', bg:'#DCEEDB', accent:'#2F6B3C' },
    { id:'dairy',    name:'Dairy & Breakfast',    emoji:'🥛', bg:'#FFF3D6', accent:'#C98A12' },
    { id:'snacks',   name:'Snacks',               emoji:'🍪', bg:'#FFE3D3', accent:'#E5601F' },
    { id:'beverages',name:'Beverages',            emoji:'🧃', bg:'#DCEFF7', accent:'#2078A0' },
    { id:'personal', name:'Personal Care',        emoji:'🧴', bg:'#EDE3F7', accent:'#6B4CB0' },
    { id:'bakery',   name:'Bakery',               emoji:'🍞', bg:'#F6E8D8', accent:'#A0691E' },
    { id:'household',name:'Household',            emoji:'🧹', bg:'#DFF3EA', accent:'#1E8A65' },
    { id:'baby',     name:'Baby Care',            emoji:'🍼', bg:'#FBE3EA', accent:'#C24C79' },
  ];

  const PRODUCTS = [
    { id:'p1', name:'Fresh Apples', unit:'1 kg', price:180, emoji:'🍎', cat:'fruits' },
    { id:'p2', name:'Ripe Bananas', unit:'1 dozen', price:60, emoji:'🍌', cat:'fruits' },
    { id:'p3', name:'Farm Tomatoes', unit:'1 kg', price:40, emoji:'🍅', cat:'fruits' },
    { id:'p4', name:'Baby Spinach', unit:'250 g', price:25, emoji:'🥬', cat:'fruits' },
    { id:'p5', name:'Carrots', unit:'500 g', price:35, emoji:'🥕', cat:'fruits' },
    { id:'p6', name:'Onions', unit:'1 kg', price:45, emoji:'🧅', cat:'fruits' },

    { id:'p7', name:'Toned Milk', unit:'1 L', price:64, emoji:'🥛', cat:'dairy' },
    { id:'p8', name:'Farm Fresh Eggs', unit:'12 pc', price:90, emoji:'🥚', cat:'dairy' },
    { id:'p9', name:'Salted Butter', unit:'100 g', price:58, emoji:'🧈', cat:'dairy' },
    { id:'p10', name:'Corn Flakes', unit:'500 g', price:210, emoji:'🥣', cat:'dairy' },
    { id:'p11', name:'Greek Yogurt', unit:'400 g', price:120, emoji:'🍶', cat:'dairy' },

    { id:'p12', name:'Potato Chips', unit:'family pack', price:30, emoji:'🍟', cat:'snacks' },
    { id:'p13', name:'Choco Chip Cookies', unit:'200 g', price:99, emoji:'🍪', cat:'snacks' },
    { id:'p14', name:'Mixed Namkeen', unit:'400 g', price:65, emoji:'🥨', cat:'snacks' },
    { id:'p15', name:'Butter Popcorn', unit:'150 g', price:45, emoji:'🍿', cat:'snacks' },

    { id:'p16', name:'Orange Juice', unit:'1 L', price:150, emoji:'🧃', cat:'beverages' },
    { id:'p17', name:'Cola', unit:'750 ml', price:40, emoji:'🥤', cat:'beverages' },
    { id:'p18', name:'Green Tea', unit:'25 bags', price:180, emoji:'🍵', cat:'beverages' },
    { id:'p19', name:'Mineral Water', unit:'1 L', price:20, emoji:'💧', cat:'beverages' },

    { id:'p20', name:'Anti-Dandruff Shampoo', unit:'340 ml', price:210, emoji:'🧴', cat:'personal' },
    { id:'p21', name:'Toothpaste', unit:'150 g', price:95, emoji:'🪥', cat:'personal' },
    { id:'p22', name:'Hand Wash', unit:'250 ml', price:85, emoji:'🧼', cat:'personal' },
    { id:'p23', name:'Face Wash', unit:'100 g', price:199, emoji:'🧴', cat:'personal' },

    { id:'p24', name:'Brown Bread', unit:'400 g', price:45, emoji:'🍞', cat:'bakery' },
    { id:'p25', name:'Butter Croissant', unit:'2 pc', price:80, emoji:'🥐', cat:'bakery' },
    { id:'p26', name:'Choco Muffins', unit:'4 pc', price:120, emoji:'🧁', cat:'bakery' },
    { id:'p27', name:'Bagels', unit:'4 pc', price:99, emoji:'🥯', cat:'bakery' },

    { id:'p28', name:'Dish Wash Liquid', unit:'500 ml', price:99, emoji:'🧽', cat:'household' },
    { id:'p29', name:'Floor Cleaner', unit:'1 L', price:149, emoji:'🧴', cat:'household' },
    { id:'p30', name:'Trash Bags', unit:'30 pc', price:129, emoji:'🗑️', cat:'household' },
    { id:'p31', name:'Tissue Paper', unit:'2 rolls', price:65, emoji:'🧻', cat:'household' },

    { id:'p32', name:'Baby Diapers', unit:'30 pc', price:499, emoji:'🍼', cat:'baby' },
    { id:'p33', name:'Baby Wipes', unit:'80 pc', price:149, emoji:'🧴', cat:'baby' },
    { id:'p34', name:'Baby Powder', unit:'200 g', price:110, emoji:'🍼', cat:'baby' },
    { id:'p35', name:'Baby Food', unit:'175 g', price:85, emoji:'🍼', cat:'baby' },
  ];

  const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const PROD_MAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const LOCATIONS = [
    'Connaught Place, New Delhi',
    'Bandra West, Mumbai',
    'Koramangala, Bengaluru',
    'Salt Lake, Kolkata',
    'Banjara Hills, Hyderabad',
    'Shivaji Nagar, Pune',
  ];

  /* ---------------- STATE ---------------- */
  let cart = {};          // { productId: qty }
  let activeCategory = 'all';
  let searchTerm = '';

  /* ---------------- HELPERS ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const $all = (sel) => document.querySelectorAll(sel);
  const money = (n) => '₹' + n.toLocaleString('en-IN');

  function showToast(msg){
    const container = $('#toastContainer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2400);
  }

  /* ---------------- RENDER CATEGORIES ---------------- */
  function renderCategories(){
    const scroller = $('#categoryScroller');
    const tiles = [{ id:'all', name:'All items', emoji:'🛍️', bg:'#EFEFE7' }, ...CATEGORIES];
    scroller.innerHTML = tiles.map(c => `
      <button class="cat-tile ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}" style="background:${c.bg}">
        <span class="cat-emoji">${c.emoji}</span>
        <span class="cat-name">${c.name}</span>
      </button>
    `).join('');
  }

  /* ---------------- RENDER PRODUCTS ---------------- */
  function renderProducts(){
    let list = PRODUCTS;
    if (activeCategory !== 'all') list = list.filter(p => p.cat === activeCategory);
    if (searchTerm) list = list.filter(p => p.name.toLowerCase().includes(searchTerm));

    const grid = $('#productGrid');
    const noResults = $('#noResults');
    const countEl = $('#resultsCount');
    const titleEl = $('#productsTitle');

    if (searchTerm) {
      titleEl.textContent = `Results for "${searchTerm}"`;
    } else if (activeCategory !== 'all') {
      titleEl.textContent = CAT_MAP[activeCategory].name;
    } else {
      titleEl.textContent = 'Popular right now';
    }
    countEl.textContent = list.length ? `${list.length} item${list.length > 1 ? 's' : ''}` : '';

    if (!list.length) {
      grid.innerHTML = '';
      noResults.classList.remove('hidden');
      return;
    }
    noResults.classList.add('hidden');

    grid.innerHTML = list.map(p => {
      const cat = CAT_MAP[p.cat];
      const qty = cart[p.id] || 0;
      return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media" style="background:${cat.bg}">
          <span>${p.emoji}</span>
          <span class="mini-badge">⚡ 8 min</span>
        </div>
        <div class="product-body">
          <span class="unit">${p.unit}</span>
          <h3>${p.name}</h3>
          <div class="product-footer">
            <span class="price">${money(p.price)}</span>
            <div class="qty-control">
              <button class="add-btn ${qty > 0 ? 'hidden' : ''}" data-action="add">ADD</button>
              <div class="stepper ${qty > 0 ? '' : 'hidden'}">
                <button data-action="dec">−</button>
                <span class="qty">${qty}</span>
                <button data-action="inc">+</button>
              </div>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  function updateCardUI(id){
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    if (!card) return;
    const qty = cart[id] || 0;
    const addBtn = card.querySelector('.add-btn');
    const stepper = card.querySelector('.stepper');
    if (qty > 0) {
      addBtn.classList.add('hidden');
      stepper.classList.remove('hidden');
      stepper.querySelector('.qty').textContent = qty;
    } else {
      addBtn.classList.remove('hidden');
      stepper.classList.add('hidden');
    }
  }

  /* ---------------- CART LOGIC ---------------- */
  function addToCart(id){
    cart[id] = (cart[id] || 0) + 1;
    updateCardUI(id);
    syncDrawerCardUI(id);
    renderCart();
    updateHeaderCart();
    pulseCart();
    showToast(`Added ${PROD_MAP[id].name} to cart`);
  }

  function changeQty(id, delta){
    const next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id];
    else cart[id] = next;
    updateCardUI(id);
    renderCart();
    updateHeaderCart();
  }

  function cartEntries(){
    return Object.keys(cart).map(id => ({ id, qty: cart[id], product: PROD_MAP[id] }));
  }

  function cartTotals(){
    const entries = cartEntries();
    const subtotal = entries.reduce((sum, e) => sum + e.product.price * e.qty, 0);
    const delivery = subtotal === 0 ? 0 : (subtotal >= 199 ? 0 : 25);
    const handling = subtotal === 0 ? 0 : 6;
    const total = subtotal + delivery + handling;
    const items = entries.reduce((sum, e) => sum + e.qty, 0);
    return { subtotal, delivery, handling, total, items };
  }

  function renderCart(){
    const entries = cartEntries();
    const t = cartTotals();
    const itemsWrap = $('#drawerItems');
    const emptyWrap = $('#drawerEmpty');
    const summaryWrap = $('#drawerSummary');

    if (!entries.length) {
      itemsWrap.classList.add('hidden');
      summaryWrap.classList.add('hidden');
      emptyWrap.classList.remove('hidden');
    } else {
      itemsWrap.classList.remove('hidden');
      summaryWrap.classList.remove('hidden');
      emptyWrap.classList.add('hidden');

      itemsWrap.innerHTML = entries.map(e => {
        const cat = CAT_MAP[e.product.cat];
        return `
        <div class="drawer-row" data-id="${e.id}">
          <div class="dmedia" style="background:${cat.bg}">${e.product.emoji}</div>
          <div class="dinfo">
            <h4>${e.product.name}</h4>
            <span class="dprice">${money(e.product.price)} · ${e.product.unit}</span>
          </div>
          <div class="stepper">
            <button data-action="dec">−</button>
            <span class="qty">${e.qty}</span>
            <button data-action="inc">+</button>
          </div>
        </div>`;
      }).join('');

      $('#sumSubtotal').textContent = money(t.subtotal);
      $('#sumDelivery').textContent = t.delivery === 0 ? 'FREE' : money(t.delivery);
      $('#sumHandling').textContent = money(t.handling);
      $('#sumTotal').textContent = money(t.total);
      $('#checkoutTotal').textContent = t.total.toLocaleString('en-IN');
    }
  }

  function syncDrawerCardUI(){ /* re-render handles it via renderCart() */ }

  function updateHeaderCart(){
    const t = cartTotals();
    const badge = $('#cartBadge');
    const headerTotal = $('#cartHeaderTotal');
    const mobileBar = $('#mobileCartBar');
    const mobileInfo = $('#mobileCartInfo');

    if (t.items > 0) {
      badge.textContent = t.items;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
    headerTotal.textContent = money(t.subtotal);

    if (t.items > 0) {
      mobileBar.classList.remove('hidden');
      mobileInfo.textContent = `${t.items} item${t.items > 1 ? 's' : ''} · ${money(t.total)}`;
    } else {
      mobileBar.classList.add('hidden');
    }
  }

  function pulseCart(){
    const btn = $('#cartBtn');
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);
  }

  /* ---------------- DRAWER OPEN/CLOSE ---------------- */
  function openCart(){
    $('#cartDrawer').classList.add('open');
    $('#overlay').classList.add('open');
  }
  function closeCart(){
    $('#cartDrawer').classList.remove('open');
    $('#overlay').classList.remove('open');
  }

  /* ---------------- MODAL ---------------- */
  function openModal(){ $('#loginModal').classList.add('open'); }
  function closeModal(){ $('#loginModal').classList.remove('open'); }

  function setModalTab(tab){
    const isLogin = tab === 'login';
    $('#tabLogin').classList.toggle('active', isLogin);
    $('#tabSignup').classList.toggle('active', !isLogin);
    $('#modalTitle').textContent = isLogin ? 'Welcome back' : 'Create your account';
    $('#modalSub').textContent = isLogin ? 'Log in to track orders and reorder faster.' : 'Sign up to start ordering in minutes.';
    $('#modalSubmitBtn').textContent = isLogin ? 'Log in' : 'Sign up';
  }

  /* ---------------- LOCATION ---------------- */
  function renderLocationDropdown(){
    const dd = $('#locationDropdown');
    dd.innerHTML = LOCATIONS.map(loc => `<button data-loc="${loc}">${loc}</button>`).join('');
  }
  function setLocation(loc){
    $('#locationAddr').textContent = loc;
    $('#locationAddrMobile').textContent = loc.split(',')[0];
    $('#locationDropdown').classList.add('hidden');
    showToast('Delivery location updated');
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initReveal(){
    const items = $all('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  /* ---------------- EVENTS ---------------- */
  function bindEvents(){
    // category clicks
    $('#categoryScroller').addEventListener('click', (e) => {
      const tile = e.target.closest('.cat-tile');
      if (!tile) return;
      activeCategory = tile.dataset.cat;
      searchTerm = '';
      $('#searchInput').value = '';
      $('#searchInputMobile').value = '';
      renderCategories();
      renderProducts();
      document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // product grid delegation
    $('#productGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const card = e.target.closest('.product-card');
      const id = card.dataset.id;
      const action = btn.dataset.action;
      if (action === 'add') addToCart(id);
      if (action === 'inc') changeQty(id, 1);
      if (action === 'dec') changeQty(id, -1);
    });

    // drawer items delegation
    $('#drawerItems').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const row = e.target.closest('.drawer-row');
      const id = row.dataset.id;
      if (btn.dataset.action === 'inc') changeQty(id, 1);
      if (btn.dataset.action === 'dec') changeQty(id, -1);
    });

    // search
    function handleSearch(val){
      searchTerm = val.trim().toLowerCase();
      renderProducts();
    }
    $('#searchInput').addEventListener('input', (e) => { handleSearch(e.target.value); $('#searchInputMobile').value = e.target.value; });
    $('#searchInputMobile').addEventListener('input', (e) => { handleSearch(e.target.value); $('#searchInput').value = e.target.value; });

    // cart open/close
    $('#cartBtn').addEventListener('click', openCart);
    $('#closeCart').addEventListener('click', closeCart);
    $('#overlay').addEventListener('click', () => { closeCart(); closeModal(); });
    $('#mobileCartBtn').addEventListener('click', openCart);
    $('#drawerShopBtn').addEventListener('click', () => {
      closeCart();
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
    $('#checkoutBtn').addEventListener('click', () => {
      showToast('Order placed! 🎉 (demo only)');
      cart = {};
      renderProducts();
      renderCart();
      updateHeaderCart();
      closeCart();
    });

    // hero buttons
    $('#heroShopBtn').addEventListener('click', () => document.getElementById('products').scrollIntoView({ behavior: 'smooth' }));
    $('#heroCatBtn').addEventListener('click', () => document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' }));

    // location
    renderLocationDropdown();
    $('#locationPill').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#locationDropdown').classList.toggle('hidden');
    });
    $('#locationDropdown').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-loc]');
      if (b) setLocation(b.dataset.loc);
    });
    document.addEventListener('click', () => $('#locationDropdown').classList.add('hidden'));

    // login modal
    $('#loginBtn').addEventListener('click', openModal);
    $('#loginBtnMobile').addEventListener('click', openModal);
    $('#modalClose').addEventListener('click', closeModal);
    $('#loginModal').addEventListener('click', (e) => { if (e.target.id === 'loginModal') closeModal(); });
    $('#tabLogin').addEventListener('click', () => setModalTab('login'));
    $('#tabSignup').addEventListener('click', () => setModalTab('signup'));
    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Logged in — welcome to QuickCart! (demo only)');
      closeModal();
    });

    // newsletter
    $('#newsletterForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! 🎉');
      e.target.reset();
    });

    // escape key closes drawer/modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeModal(); }
    });
  }

  /* ---------------- INIT ---------------- */
  function init(){
    renderCategories();
    renderProducts();
    renderCart();
    updateHeaderCart();
    bindEvents();
    initReveal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();