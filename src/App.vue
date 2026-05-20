<script setup>
import Navbar from "./components/Navbar.vue"
import { onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

onMounted(async () => {
  await auth.init(); 
});
</script>

<template>
  <Navbar />
  <router-view />
</template>
