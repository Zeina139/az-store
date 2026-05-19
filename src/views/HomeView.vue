<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { supabase } from "../lib/supabase"
import ProductCard from "../components/ProductCard.vue"
import { useAuthStore } from "@/stores/auth"
import Toast from "@/components/Toast.vue"
import ProductSkeleton from "@/components/ProductSkeleton.vue"

const auth = useAuthStore()

const products = ref([])
const loading = ref(true)
const categories = ref([])

// 🔥 Toast (كان ناقص)
const showToast = ref(false)
const toastMessage = ref("")
const toastType = ref("success")

// 🔍 search debounce
const searchInput = ref("")
const search = ref("")
let timeout = null

watch(searchInput, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    search.value = val
  }, 300)
})

// 🎯 filters
const selectedCategory = ref("all")
const sortOption = ref("default")

// 🧠 filtered
const filteredProducts = computed(() => {
  let filtered = [...products.value] // 🔥 fix reference bug

  // category
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      p => p.category?.id === selectedCategory.value
    )
  }

  // search
  if (search.value) {
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // sorting
  if (sortOption.value === "price-asc") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortOption.value === "price-desc") {
    filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
})

// 📦 fetch data (محسّن)
onMounted(async () => {
  loading.value = true

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select(`*, category:categories(id, name)`),
      supabase.from("categories").select("*")
    ])

    if (productsRes.error) throw productsRes.error
    if (categoriesRes.error) throw categoriesRes.error

    products.value = productsRes.data || []
    categories.value = categoriesRes.data || []

  } catch (error) {
    console.error("Fetch error:", error)

    // 🔥 toast error
    toastMessage.value = "حدث خطأ أثناء تحميل البيانات"
    toastType.value = "error"
    showToast.value = true

    setTimeout(() => showToast.value = false, 3000)
  }

  loading.value = false
})
</script>

<template>
  <Toast 
    :show="showToast" 
    :message="toastMessage" 
    :type="toastType" 
  />

  <div class="home container">

    <!-- Controls -->
    <div class="controls">
      
      <input
        type="text"
        v-model="searchInput"
        placeholder="ابحث عن منتج..."
        class="search-input"
      />

      <select v-model="selectedCategory" class="filter-select">
        <option value="all">كل الفئات</option>

        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>

      <select v-model="sortOption" class="filter-select">
        <option value="default">الافتراضي</option>
        <option value="price-asc">السعر تصاعدي</option>
        <option value="price-desc">السعر تنازلي</option>
      </select>

    </div>

    <!-- Products -->
    <div class="products-grid">

      <!-- Skeleton -->
      <template v-if="loading">
        <ProductSkeleton v-for="i in 6" :key="i" />
      </template>

      <!-- Products -->
      <template v-else>
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </template>

    </div>

    <!-- States -->
    <div v-if="loading" class="loading">جارٍ التحميل...</div>

    <div v-else-if="!filteredProducts.length" class="empty">
      لا توجد منتجات
    </div>

  </div>
</template>

<style scoped>
.home.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  transition: all 0.3s ease;
}

/* Controls */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
  justify-content: flex-start;
}

.search-input, .filter-select {
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  outline: none;
  font-size: 14px;
  transition: 0.3s ease;
}

.search-input {
  flex: 1 1 200px;
  background: var(--card-bg);
  color: var(--text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.search-input::placeholder {
  color: var(--muted);
}

.search-input:focus {
  transform: scale(1.02);
  box-shadow: 0 6px 18px rgba(248,165,194,0.35);
}

.filter-select {
  background: var(--card-bg);
  color: var(--text);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 10;
}

.filter-select:focus {
  transform: scale(1.03);
  box-shadow: 0 6px 18px rgba(248,165,194,0.35);
  background: var(--card-bg);
  color: var(--text);
}

/* Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* States */
.loading, .empty {
  text-align: center;
  color: var(--muted);
  font-size: 16px;
  margin-top: 40px;
  font-weight: 500;
}

/* Dark mode */
body.dark-mode .search-input,
body.dark-mode .filter-select {
  background: linear-gradient(145deg, #2a1820, #3b1f2d);
  color: #ffe3f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

body.dark-mode .search-input::placeholder {
  color: #ffb2d1;
}

option {
  background: var(--card-bg);
  color: var(--text);
}
</style>