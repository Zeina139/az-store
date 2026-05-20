<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"
import { useRoute, useRouter } from "vue-router"
import { useCartStore } from "@/stores/cart"
import AuthRequiredModal from "@/components/AuthRequiredModal.vue"

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const showAuthModal = ref(false)

const product = ref(null)
const loading = ref(true)
const productId = route.params.id

onMounted(async () => {
  loading.value = true
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()
  
  if(error){
    console.error(error)
    loading.value = false
    return
  }

  product.value = data
  loading.value = false
})


const addToCart = async () => {

  const { data: { user } } = await supabase.auth.getUser()


if (!user) {
  localStorage.setItem("pendingProduct", JSON.stringify(product.value))
  showAuthModal.value = true
  return
}

  await cartStore.addToCart(product.value)

  alert("تمت إضافة المنتج إلى السلة 🛒")
}
</script>

<template>
<div class="product-details-container card" v-if="!loading && product">

  <button class="back-btn btn-baby" @click="router.push('/')">← عودة</button>

  <div class="product-main">
    <div class="image-section">
      <img :src="product.image" :alt="product.name" class="product-image card"/>
    </div>

    <div class="info-section">
      <h1 class="product-name">{{ product.name }}</h1>
      <p class="product-price">ل.س {{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>

      <button class="add-cart-btn btn-baby" @click="addToCart">
        أضف إلى السلة
      </button>
    </div>
  </div>
</div>

<div v-else class="loading">Loading...</div>
</template>

<style scoped>
.product-details-container{
  max-width:900px;
  margin:50px auto;
  padding:30px;
  display:flex;
  flex-direction:column;
  gap:20px;
}

.back-btn{
  align-self:flex-start;
  font-weight:600;
  cursor:pointer;
}

.product-main{
  display:flex;
  flex-wrap:wrap;
  gap:40px;
}

.image-section{
  flex:1 1 350px;
}

.product-image{
  width:100%;
  border-radius:20px;
  object-fit:cover;
  box-shadow:0 15px 35px rgba(248,165,194,0.2);
  transition:0.3s ease;
}
.product-image:hover{
  transform: scale(1.03);
}

.info-section{
  flex:1 1 400px;
  display:flex;
  flex-direction:column;
  gap:15px;
}

.product-name{
  font-size:32px;
  font-weight:700;
  color: var(--primary-dark);
}

.product-price{
  font-size:24px;
  font-weight:600;
  color: var(--primary);
}

.product-description{
  font-size:16px;
  color: var(--muted);
  line-height:1.6;
}

.add-cart-btn{
  margin-top:20px;
  font-size: 1.5em;
  padding:12px 25px;
  border-radius:40px;
  cursor:pointer;
  width:fit-content;
}

.loading{
  text-align:center;
  font-size:18px;
  color: var(--muted);
  margin-top:50px;
}
</style>