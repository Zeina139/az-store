<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "../../lib/supabase"

const totalUsers = ref(0)
const totalProducts = ref(0)
const totalOrders = ref(0)

const loadStats = async () => {

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  totalUsers.value = usersCount || 0
  totalProducts.value = productsCount || 0
  totalOrders.value = ordersCount || 0
}

onMounted(loadStats)
</script>

<template>

<div class="dashboard">

<h1 class="title">Admin Dashboard</h1>

<div class="cards">

<div class="card">
<h3>Total Users</h3>
<p>{{ totalUsers }}</p>
</div>

<div class="card">
<h3>Total Products</h3>
<p>{{ totalProducts }}</p>
</div>

<div class="card">
<h3>Total Orders</h3>
<p>{{ totalOrders }}</p>
</div>

</div>

</div>

</template>

<style scoped>

.title{
font-size:28px;
margin-bottom:30px;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:20px;
}

.card{
background:white;
padding:25px;
border-radius:14px;
box-shadow:0 5px 15px rgba(0,0,0,0.05);
transition:0.2s;
}

.card:hover{
transform:translateY(-4px);
}

.card h3{
color:#666;
margin-bottom:10px;
}

.card p{
font-size:28px;
font-weight:700;
color:#3d909e;
}

</style>