<script setup>
import { ref, onMounted, computed } from "vue"
import { supabase } from "@/lib/supabase"

const orders = ref([])
const loading = ref(true)
const search = ref("")
const filterStatus = ref("all")

async function loadOrders() {
  loading.value = true

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      name,
      phone,
      address,
      order_items (
        id,
        product_name,
        price,
        quantity
      )
    `)
    .order("created_at", { ascending: false })

  if (error) console.log(error)
  else orders.value = data

  loading.value = false
}

const updateStatus = async (orderId, newStatus) => {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)

  if(error){
    console.log(error)
    return
  }


  const order = orders.value.find(o => o.id === orderId)
  if(order) order.status = newStatus
}

onMounted(loadOrders)

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesStatus = filterStatus.value === "all" || order.status === filterStatus.value
    const matchesSearch = search.value === "" || 
      order.id.includes(search.value) || 
      order.name.toLowerCase().includes(search.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})
</script>

<template>
<div class="admin-orders container py-5">

  <h2 class="mb-4 fw-bold">🛒 Orders Management</h2>

  <!-- Filters -->
  <div class="mb-3 d-flex flex-wrap gap-2">
    <input v-model="search" placeholder="Search by order ID or user name" class="form-control" style="max-width:300px"/>
    <select v-model="filterStatus" class="form-select" style="max-width:200px">
      <option value="all">الكل</option>
      <option value="pending">انتظار</option>
      <option value="shipped">تم الشحن</option>
      <option value="delivered">تم التوصيل</option>
      <option value="cancelled">ملغي</option>
    </select>
  </div>

  <!-- Loading -->
  <div v-if="loading" class="text-center">Loading...</div>

  <!-- No orders -->
  <div v-else-if="filteredOrders.length === 0" class="text-center text-muted">
    No orders found 😢
  </div>

  <!-- Orders List -->
  <div v-else class="row g-4">
    <div v-for="order in filteredOrders" :key="order.id" class="col-12 col-lg-6">
      <div class="order-card p-4 shadow-sm rounded">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6>Order #{{ order.id.slice(0,6) }}</h6>
            <small>User: {{ order.name }}</small><br>
            <small>Phone: {{ order.phone }}</small><br>
            <small>Address: {{ order.address }}</small><br>
            <small>{{ new Date(order.created_at).toLocaleString() }}</small>
          </div>

          <!-- Status -->
          <select v-model="order.status" 
                  @change="updateStatus(order.id, order.status)" 
                  :class="{
                    'bg-warning text-dark': order.status === 'pending',
                    'bg-info text-white': order.status === 'shipped',
                    'bg-success text-white': order.status === 'delivered',
                    'bg-danger text-white': order.status === 'cancelled'
                  }"
                  class="form-select form-select-sm">
            <option value="pending">انتظار</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <!-- Products -->
        <div class="products">
          <div v-for="item in order.order_items" :key="item.id" class="d-flex justify-content-between mb-1">
            <span>{{ item.product_name }} × {{ item.quantity }}</span>
            <span>ل.س {{ item.price * item.quantity }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="total mt-3 d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>ل.س {{ order.total }}</span>
        </div>

      </div>
    </div>
  </div>

</div>
</template>

<style scoped>
.order-card select {
  width: 140px;
  border-radius: 6px;
}
.order-card select.bg-warning { background: #ffc107; }
.order-card select.bg-primary { background: #0d6efd; }
.order-card select.bg-info { background: #0dcaf0; }
.order-card select.bg-success { background: #198754; }
.order-card select.bg-danger { background: #dc3545; }
</style>