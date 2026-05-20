<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import { useCartStore } from "../stores/cart"
import { useRouter, useRoute } from "vue-router"
import { logout } from "../services/auth"
import { useAuthStore } from "@/stores/auth"

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const darkMode = ref(false)
const menuOpen = ref(false)
const accountOpen = ref(false) // خليها false افتراضياً
const accountDropdownRef = ref(null)


const toggleTheme = () => {
  darkMode.value = !darkMode.value
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("theme", darkMode.value ? "dark" : "light")
}


const toggleMenu = () => menuOpen.value = !menuOpen.value
const closeMenu = () => menuOpen.value = false

const toggleAccount = () => accountOpen.value = !accountOpen.value
const closeAccount = () => accountOpen.value = false


const handleLogout = async () => {
  try {
    await logout()
    router.push("/login")
    closeAccount()
  } catch (e) {
    console.error("Logout error:", e)
  }
}


const handleClickOutside = (e) => {
  if (accountDropdownRef.value && !accountDropdownRef.value.contains(e.target)) {
    accountOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
  
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    darkMode.value = true
    document.body.classList.add("dark-mode")
  }

  auth.init()
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})


watch(route, () => {
  menuOpen.value = false
  accountOpen.value = false
})

watch(menuOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "auto"
})


watch(() => auth.user.value, (newVal) => {
  if (!newVal) accountOpen.value = false
})
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="brand">✨ A&Z STORE</router-link>

      <!-- Hamburger -->
      <button class="hamburger" @click="toggleMenu">
        <div :class="['burger', { open: menuOpen }]"></div>
      </button>

      <!-- Overlay -->
      <div v-if="menuOpen" class="overlay" @click="closeMenu"></div>

      <!-- Menu -->
      <div :class="['nav-links', { open: menuOpen }]">
        <router-link @click="closeMenu" to="/" class="nav-item" :class="{ active: route.path === '/' }">
          المتجر
        </router-link>
        <router-link @click="closeMenu" to="/cart" class="nav-item">
          السلة
          <span v-if="cartStore.items.length" class="cart-badge">
            {{ cartStore.items.length }}
          </span>
        </router-link>
        <router-link v-if="auth.user.value" @click="closeMenu" to="/myorders" class="nav-item">
          طلباتي
        </router-link>
        <router-link @click="closeMenu" to="/about" class="nav-item">عن الصفحة</router-link>
        <router-link @click="closeMenu" to="/contact" class="nav-item">تواصل</router-link>
        <router-link v-if="auth.role?.value === 'admin'" @click="closeMenu" to="/admin" class="nav-item admin">
          لوحة التحكم
        </router-link>

        <!-- الحساب -->
        <div class="account-wrapper">
          <button class="account-btn" @click.stop="toggleAccount">👤 الحساب</button>
          <div ref="accountDropdownRef" class="account-dropdown" v-show="accountOpen">
            <template v-if="auth.user.value">
              <div class="user-info">{{ auth.user.value.email }}</div>
              <button @click="closeMenu(); closeAccount(); router.push('/myorders')" class="dropdown-item">طلباتي</button>
              <button @click="handleLogout" class="dropdown-item logout">تسجيل خروج</button>
            </template>
            <template v-else>
              <button @click="closeMenu(); closeAccount(); router.push('/login')" class="dropdown-item">تسجيل دخول</button>
              <button @click="closeMenu(); closeAccount(); router.push('/register')" class="dropdown-item register">إنشاء حساب</button>
            </template>
          </div>
        </div>

        <button class="theme-btn" @click="toggleTheme">{{ darkMode ? '☀' : '🌙' }}</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar { position: sticky; top: 0; 
  z-index: 2000; 
  background: linear-gradient(90deg, var(--accent-light), var(--primary));
   padding: 14px 20px;
    border-radius: 0 0 25px 25px;
     box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
    }

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  color: var(--text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-item {
  text-decoration: none;
  color: var(--text);
  transition: 0.25s;
}
.nav-item:hover {
  transform: translateX(5px);
  color: var(--primary-dark);
}

.cart-badge {
  background: var(--primary-dark);
  color: white;
  border-radius: 50%;
  padding: 3px 7px;
  font-size: 11px;
}
.account-wrapper {
  position: relative;
}

.account-btn {
  background: rgba(255,255,255,0.3);
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: 0.25s;
}

.account-btn:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.4);
}

/* dropdown */
.account-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  min-width: 180px;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 5000;
  animation: fadeIn 0.2s ease;
}

.user-info {
  font-size: 12px;
  padding: 8px;
  opacity: 0.7;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.dropdown-item {
  border: none;
  background: transparent;
  text-align: right;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: rgba(0,0,0,0.05);
}

.dropdown-item.register {
  background: linear-gradient(135deg, #ff8fb1, #ff4d88);
  color: white;
}

.dropdown-item.logout {
  color: #ff4d6d;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .auth-links {
    flex-direction: column;
    width: 100%;
  }

  .login-btn,
  .register-btn {
    width: 100%;
    text-align: center;
  }

  .auth-separator {
    margin: 6px 0;
  }
}

.logout-btn {
  background: #ff4d6d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
}

.theme-btn {
  border: none;
  border-radius: 50%;
  padding: 6px 10px;
  cursor: pointer;
}

/* hamburger */
.hamburger {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
  border: none;
  justify-content: center;
  align-items: center;
}

.burger {
  position: relative;
  width: 22px;
  height: 2px;
  background: var(--text);
}

.burger::before,
.burger::after {
  content: "";
  position: absolute;
  left: 0;
  width: 22px;
  height: 2px;
  background: var(--text);
}

.burger::before { top: -7px; }
.burger::after { top: 7px; }

.burger.open { background: transparent; }
.burger.open::before { transform: rotate(45deg); }
.burger.open::after { transform: rotate(-45deg); }

/* overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
}

/* mobile */
@media (max-width: 768px) {
  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 80%;
    max-width: 320px;
    background: var(--card-bg);
    padding: 80px 20px;
    flex-direction: column;
    transform: translateX(100%);
    transition: 0.3s;
    z-index: 3000;
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .auth-section {
    flex-direction: column;
    width: 100%;
  }

  .register-btn,
  .logout-btn {
    width: 100%;
    text-align: center;
  }
}
</style>