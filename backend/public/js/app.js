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
        const el = document.getElementById('cart-count')
        if (el) {
            const c = Cart.count()
            el.textContent = c
            el.style.display = c > 0 ? 'flex' : 'none'
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
            // Build dropdown
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

// ===== API =====
const API = {
    base: '/api',
    headers: () => ({
        'Content-Type': 'application/json',
        ...(Auth.getToken() ? { Authorization: `Bearer ${Auth.getToken()}` } : {})
    }),
    get: (url) => fetch(API.base + url, { headers: API.headers() }).then(r => r.json()),
    post: (url, data) => fetch(API.base + url, { method: 'POST', headers: API.headers(), body: JSON.stringify(data) }).then(r => r.json()),
    put: (url, data) => fetch(API.base + url, { method: 'PUT', headers: API.headers(), body: JSON.stringify(data) }).then(r => r.json()),
    delete: (url) => fetch(API.base + url, { method: 'DELETE', headers: API.headers() }).then(r => r.json())
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
    Cart.updateCount()
    Auth.updateNavbar()

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
