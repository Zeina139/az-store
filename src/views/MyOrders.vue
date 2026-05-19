<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"

const orders = ref([])
const loading = ref(true)

async function loadOrders() {
  loading.value = true

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      order_items (
        product_name,
        price,
        quantity
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.log(error)
  } else {
    orders.value = data
  }

  loading.value = false
}
console.log(orders.value)
const getStatusText = (status) => {
  switch(status){
    case 'pending': return '🕓 قيد المعالجة'
    case 'shipped': return '🚚 تم الشحن'
    case 'delivered': return '✅ تم التسليم'
    default: return '❓ غير معروف'
  }
}
const getStatusClass = (status) => {
  switch(status){
    case 'pending': return 'bg-warning text-dark '
    case 'shipped': return 'bg-info text-dark'
    case 'delivered': return 'bg-success'
    default: return 'bg-secondary'
  }
}
onMounted(loadOrders)
</script>

<template>
  <div class="orders-page container py-5">
    
    <h2 class="mb-4 fw-bold">🛍️ طلباتي</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      يتم التحميل...
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="text-center text-muted">
      لا توجد طلبات بعد 😢
    </div>

    <!-- Orders -->
    <div v-else class="row g-4">
      
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="col-12 col-lg-6"
      >
        <div class="order-card p-4">

          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 class="fw-bold mb-1">الطلب #{{ order.id.slice(0, 6) }}</h6>
              <small class="text-muted">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </small>
            </div>
<span 
  class="badge px-3 py-2"
  :class="getStatusClass(order.status)"
>
  {{ getStatusText(order.status) }}
</span>
          </div>

          <!-- Products -->
          <div class="products">
            <div 
              v-for="item in order.order_items" 
              :key="item.product_name"
              class="product-row d-flex justify-content-between"
            >
              <span>{{ item.product_name }} × {{ item.quantity }}</span>
              <span>ل.س {{ item.price * item.quantity }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="total mt-3 d-flex justify-content-between">
            <strong>المجموع</strong>
            <strong>ل.س {{ order.total }}</strong>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.order-card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: 0.3s;
}

.order-card:hover {
  transform: translateY(-5px);
}

.product-row {
  padding: 6px 0;
  border-bottom: 1px dashed #ddd;
  font-size: 14px;
}

.total {
  font-size: 16px;
}
</style>