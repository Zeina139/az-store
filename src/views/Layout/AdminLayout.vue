<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "@/lib/supabase"

const router = useRouter()

const logout = async () => {
  await supabase.auth.signOut()
  router.push("/login")
}
</script>

<template>
<div class="admin-layout">

  <aside class="sidebar">
    <h2 class="logo">Admin Panel</h2>

    <router-link to="/admin" class="nav-item">
      Dashboard
    </router-link>

    <router-link to="/admin/products" class="nav-item">
      Products
    </router-link>

    <router-link to="/admin/orders" class="nav-item">
      Orders
    </router-link>

    <button class="logout" @click="logout">
      Logout
    </button>
  </aside>

  <main class="content">
    <router-view />
  </main>

</div>
</template>

<style scoped>

.admin-layout{
  display:flex;
  min-height:100vh;
  background: var(--bg);
}

.sidebar{
  width:230px;
  background: var(--card-bg);
  padding:25px;
  box-shadow:0 0 15px rgba(0,0,0,0.05);
  display:flex;
  flex-direction:column;
  gap:15px;
  transition:0.3s ease;
}

.logo{
  color: var(--primary);
  font-weight:700;
  margin-bottom:20px;
}

.nav-item{
  text-decoration:none;
  color: var(--text);
  padding:10px;
  border-radius:8px;
  transition:0.2s;
}
.nav-item:hover{
  background: var(--primary);
  color:white;
}

.logout{
  margin-top:auto;
  background: #c16a17;
  border:none;
  color:white;
  padding:10px;
  border-radius:8px;
  cursor:pointer;
}

.content{
  flex:1;
  padding:40px;
  background: var(--bg);
  transition:0.3s ease;
}

</style>