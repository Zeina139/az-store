<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useCartStore } from "../stores/cart"
import { useAuthStore } from "@/stores/auth"
import Toast from "@/components/Toast.vue"

const showToast = ref(false)
const toastMessage = ref("")
const toastType = ref("success")

const props = defineProps({
  product: Object
})

const router = useRouter()
const cartStore = useCartStore()
const auth = useAuthStore()

const isAdding = ref(false)
const isLoggedIn = computed(() => !!auth.user.value)

const goToDetails = () => {
  router.push(`/product/${props.product.id}`)
}

const handleAction = async (event) => {
  if (!isLoggedIn.value) {
    localStorage.setItem("redirectAfterLogin", router.currentRoute.value.fullPath)
    router.push("/login")
    return
  }

  if (isAdding.value) return
  isAdding.value = true

  try {
    await cartStore.addToCart(props.product)
    flyToCart(event)
    toastMessage.value = "تمت إضافة المنتج للسلة 🛒"
    toastType.value = "success"
    showToast.value = true
  } catch (error) {
    toastMessage.value = "حدث خطأ أثناء إضافة المنتج للسلة"
    toastType.value = "error"
    showToast.value = true
  } finally {
    isAdding.value = false
  }
}

const flyToCart = (event) => {
  const cart = document.getElementById("cart-icon")
  if (!cart) return
  const img = event.currentTarget.closest(".card").querySelector("img")
  if (!img) return

  const imgRect = img.getBoundingClientRect()
  const cartRect = cart.getBoundingClientRect()

  const clone = img.cloneNode(true)
  clone.style.position = "fixed"
  clone.style.top = `${imgRect.top}px`
  clone.style.left = `${imgRect.left}px`
  clone.style.width = `${imgRect.width}px`
  clone.style.height = `${imgRect.height}px`
  clone.style.borderRadius = "12px"
  clone.style.zIndex = "9999"
  clone.style.transition = "all 0.8s cubic-bezier(.65,-0.2,.25,1.3)"
  document.body.appendChild(clone)

  requestAnimationFrame(() => {
    clone.style.top = `${cartRect.top}px`
    clone.style.left = `${cartRect.left}px`
    clone.style.width = "40px"
    clone.style.height = "40px"
    clone.style.opacity = "0.5"
    clone.style.transform = "scale(0.5)"
  })

  setTimeout(() => clone.remove(), 800)
}
</script>

<template>
  <Toast :message="toastMessage" :type="toastType" :show="showToast"/>
  <div class="card" @click="goToDetails">
    <div class="image">
      <img :src="product.image" alt="product image"/>
      <div class="overlay">
        <button @click.stop="handleAction($event)" :disabled="isAdding">
          <span v-if="isAdding">⏳ جاري الإضافة...</span>
          <span v-else-if="!isLoggedIn">🔐 سجل الدخول</span>
          <span v-else>🛒 أضف للسلة</span>
        </button>
      </div>
    </div>

    <div class="info">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <div class="price">{{ product.price }} ل.س</div>
      <button class="add-to-cart-mobile" @click.stop="handleAction($event)" :disabled="isAdding">
        <span v-if="isAdding">⏳ جاري الإضافة...</span>
        <span v-else-if="!isLoggedIn">🔐 سجل الدخول</span>
        <span v-else>🛒 أضف للسلة</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #3d909e;
  --primary-dark: #2a6b73;
  --text: #222;
  --text-light: #fff;
  --muted: #777;
  --card-bg: #fff;
}

[data-theme="dark"] {
  --card-bg: #1e1e1e;
  --text: #eee;
  --muted: #aaa;
  --primary-dark: #3d909e;
}

.card {
  background: var(--card-bg);
  color: var(--text);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.image {
  position: relative;
  height: 250px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 18px;
}

.card:hover .overlay {
  opacity: 1;
}

.overlay button {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-light);
  font-weight: 600;
  border-radius: 12px;
  padding: 12px 22px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.overlay button:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 25px rgba(61,144,158,0.35);
}

.info {
  padding: 15px;
}

.info h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.info p {
  font-size: 13px;
  color: var(--muted);
  margin: 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  margin-top: 10px;
  font-weight: bold;
  color: var(--primary-dark);
  font-size: 15px;
}

.add-to-cart-mobile {
  display: none;
  width: 100%;
  padding: 12px 0;
  margin-top: 10px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-light);
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .overlay {
    display: none;
  }

  .add-to-cart-mobile {
    display: block;
  }

  .image {
    height: 220px;
  }
}
</style>