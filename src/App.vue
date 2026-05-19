<script setup>
import Navbar from "./components/Navbar.vue"
import { onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

onMounted(async () => {
  await auth.init(); // ✅ تأكد إنه session جاهز قبل أي شيء
});
</script>

<template>
  <Navbar />
  <router-view />
</template>
