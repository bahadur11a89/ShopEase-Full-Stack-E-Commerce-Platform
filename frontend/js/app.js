// ===== CART =====
const Cart = {
    get: () => JSON.parse(localStorage.getItem('cart') || '[]'),
    save: (cart) => { localStorage.setItem('cart', JSON.stringify(cart)); Cart.updateCount(); },
    add: (product) => {
        const cart = Cart.get()
        const existing = cart.find(i => i._id === product._id)
        if (existing) existing.qty += 1
        else cart.push({ ...product, qty: 1 })
        Cart.save(cart)
        showToast(`${product.name} added to cart! 🛒`, 'success')
    },
    remove: (id) => { Cart.save(Cart.get().filter(i => i._id !== id)) },
    updateQty: (id, qty) => {
        const cart = Cart.get()
        const item = cart.find(i => i._id === id)
        if (item) { item.qty = qty; if (item.qty <= 0) return Cart.remove(id) }
        Cart.save(cart)
    },
    clear: () => { localStorage.removeItem('cart'); Cart.updateCount(); },
    total: () => Cart.get().reduce((acc, i) => acc + i.price * i.qty, 0),
    count: () => Cart.get().reduce((acc, i) => acc + i.qty, 0),
    updateCount: () => {
        const c = Cart.count()
        const el = document.getElementById('cart-count')
        if (el) {
            el.textContent = c
            el.style.display = c > 0 ? 'flex' : 'none'
        }
        const mEl = document.getElementById('mobile-cart-count')
        if (mEl) {
            mEl.textContent = c
            mEl.style.display = c > 0 ? 'inline-block' : 'none'
        }
    }
}

// ===== AUTH =====
const Auth = {
    getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
    getToken: () => Auth.getUser()?.token || null,
    isLoggedIn: () => !!Auth.getToken(),
    logout: () => {
        localStorage.removeItem('user')
        showToast('Logged out successfully. See you soon! 👋', 'success')
        setTimeout(() => window.location.href = '/login', 800)
    },
    updateNavbar: () => {
        const user = Auth.getUser()
        const loginLink = document.getElementById('nav-login')
        const userMenu = document.getElementById('nav-user')
        if (user && loginLink && userMenu) {
            loginLink.style.display = 'none'
            userMenu.style.display = 'block'
            const firstName = user.name.split(' ')[0]
            const isAdmin = user.role === 'admin'
            userMenu.innerHTML = `
                <div class="nav-dropdown">
                    <button class="nav-dropdown-btn">👤 ${firstName} ▾</button>
                    <div class="nav-dropdown-menu">
                        <a href="/profile">👤 My Profile</a>
                        <a href="/cart">🛒 My Cart</a>
                        ${isAdmin ? '<a href="/admin">⚙️ Admin Panel</a>' : ''}
                        <div class="nav-dropdown-divider"></div>
                        <a href="#" onclick="Auth.logout();return false;" style="color:#dc3545">🚪 Logout</a>
                    </div>
                </div>`
        } else if (loginLink) {
            loginLink.style.display = 'block'
            if (userMenu) userMenu.style.display = 'none'
        }
    }
}

// ===== LAYOUT & MOBILE NAVIGATION DRAWER =====
const Layout = {
    init: () => {
        Layout.ensureMobileDrawer()
        Cart.updateCount()
        Auth.updateNavbar()
        Layout.highlightActiveNav()
    },
    ensureMobileDrawer: () => {
        if (!document.getElementById('mobile-drawer')) {
            const drawer = document.createElement('div')
            drawer.id = 'mobile-drawer'
            drawer.className = 'mobile-drawer'
            
            const user = Auth.getUser()
            const firstName = user ? user.name.split(' ')[0] : ''
            const isAdmin = user?.role === 'admin'

            drawer.innerHTML = `
                <div class="mobile-drawer-header">
                    <a href="/" class="logo">Shop<span>Ease</span></a>
                    <button class="mobile-drawer-close" onclick="Layout.closeDrawer()">✕</button>
                </div>
                <div class="mobile-drawer-body">
                    <a href="/">🏠 Home</a>
                    <a href="/shop">🛍️ Shop</a>
                    <a href="/about">ℹ️ About Us</a>
                    <a href="/services">⚡ Services</a>
                    <a href="/gallery">🖼️ Gallery</a>
                    <a href="/contact">📞 Contact Us</a>
                    <a href="/cart">🛒 Cart <span id="mobile-cart-count" style="background:var(--danger);color:#fff;font-size:11px;padding:2px 8px;border-radius:10px;display:none">0</span></a>
                    <div class="mobile-drawer-divider"></div>
                    ${user ? `
                        <a href="/profile">👤 My Profile (${firstName})</a>
                        ${isAdmin ? '<a href="/admin">⚙️ Admin Panel</a>' : ''}
                        <a href="#" onclick="Auth.logout();return false;" style="color:#dc3545">🚪 Logout</a>
                    ` : `
                        <a href="/login" style="color:#ffc107;font-weight:700">🔑 Login</a>
                        <a href="/register">🚀 Register</a>
                    `}
                </div>`
            document.body.appendChild(drawer)
        }

        if (!document.getElementById('mobile-overlay')) {
            const overlay = document.createElement('div')
            overlay.id = 'mobile-overlay'
            overlay.className = 'mobile-overlay'
            overlay.onclick = () => Layout.closeDrawer()
            document.body.appendChild(overlay)
        }

        const nav = document.querySelector('header nav')
        if (nav && !document.getElementById('hamburger-btn')) {
            const btn = document.createElement('button')
            btn.id = 'hamburger-btn'
            btn.className = 'hamburger-btn'
            btn.innerHTML = '☰'
            btn.title = 'Open Menu'
            btn.onclick = () => Layout.toggleDrawer()
            nav.insertBefore(btn, nav.firstChild)
        }
    },
    toggleDrawer: () => {
        const drawer = document.getElementById('mobile-drawer')
        const overlay = document.getElementById('mobile-overlay')
        if (drawer && overlay) {
            drawer.classList.toggle('open')
            overlay.classList.toggle('show')
        }
    },
    closeDrawer: () => {
        const drawer = document.getElementById('mobile-drawer')
        const overlay = document.getElementById('mobile-overlay')
        if (drawer && overlay) {
            drawer.classList.remove('open')
            overlay.classList.remove('show')
        }
    },
    highlightActiveNav: () => {
        const path = window.location.pathname
        document.querySelectorAll('header nav ul li a, .mobile-drawer-body a').forEach(a => {
            const href = a.getAttribute('href')
            if (href === path || (path === '/' && href === '/') || (href !== '/' && path.startsWith(href))) {
                if (!a.classList.contains('nav-btn')) a.classList.add('active')
            }
        })
    }
}

// ===== API =====
const API = {
    base: '/api',
    headers: () => ({
        'Content-Type': 'application/json',
        ...(Auth.getToken() ? { Authorization: `Bearer ${Auth.getToken()}` } : {})
    }),
    request: async (url, options = {}) => {
        try {
            const res = await fetch(API.base + url, {
                ...options,
                headers: { ...API.headers(), ...(options.headers || {}) }
            })
            const contentType = res.headers.get('content-type') || ''
            let data
            if (contentType.includes('application/json')) {
                data = await res.json()
            } else {
                const text = await res.text()
                data = { status: res.status, message: text || `HTTP ${res.status} ${res.statusText}`, ok: false }
            }
            if (!res.ok && typeof data === 'object' && data !== null) {
                if (!data.message) data.message = `HTTP ${res.status}: ${res.statusText}`
                data.ok = false
                data.status = res.status
            }
            return data
        } catch (err) {
            return { ok: false, status: 0, message: err.message || 'Network Error' }
        }
    },
    get: (url) => API.request(url, { method: 'GET' }),
    post: (url, data) => API.request(url, { method: 'POST', body: JSON.stringify(data) }),
    put: (url, data) => API.request(url, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (url) => API.request(url, { method: 'DELETE' })
}

// ===== TOAST =====
function showToast(msg, type = '') {
    let toast = document.getElementById('toast')
    if (!toast) {
        toast = document.createElement('div')
        toast.id = 'toast'
        toast.className = 'toast'
        document.body.appendChild(toast)
    }
    toast.textContent = msg
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3000)
}

// ===== HELPERS =====
function renderStars(rating) {
    let html = ''
    for (let i = 1; i <= 5; i++) html += `<span style="color:${i <= Math.round(rating) ? '#ffc107' : '#ddd'}">★</span>`
    return html
}

function calcDiscount(price, original) {
    if (!original || original <= price) return 0
    return Math.round((original - price) / original * 100)
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    Layout.init()

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('show'))
        }
    })

    // Dropdown toggle
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-dropdown-btn')
        if (btn) {
            e.stopPropagation()
            const menu = btn.nextElementSibling
            document.querySelectorAll('.nav-dropdown-menu').forEach(m => { if (m !== menu) m.classList.remove('show') })
            menu.classList.toggle('show')
        }
    })
})
