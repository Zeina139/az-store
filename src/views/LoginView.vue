<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "../lib/supabase"
import { useRouter } from "vue-router"
import { useCartStore } from "@/stores/cart"

const router = useRouter()
const cartStore = useCartStore()

const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMsg = ref("")
const showPassword = ref(false)

const handleLogin = async () => {
  errorMsg.value = ""
  if (!email.value || !password.value) {
    errorMsg.value = "يرجى تعبئة جميع الحقول"
    return
  }

  loading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  loading.value = false

  if (error) {
    errorMsg.value = "بيانات تسجيل الدخول غير صحيحة"
    return
  }

  const redirect = localStorage.getItem("redirectAfterLogin")
  router.push(redirect || "/")
}

// إضافة المنتج المعلق بعد login
onMounted(async () => {
  const pending = localStorage.getItem("pendingProduct")
  if (pending) {
    const product = JSON.parse(pending)
    await cartStore.addToCart(product)
    localStorage.removeItem("pendingProduct")
  }
  localStorage.removeItem("redirectAfterLogin")
})
</script>

<template>
<div class="login-container">
  <div class="card-login">
    <h2 class="title">تسجيل الدخول</h2>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <input v-model="email" type="email" placeholder="البريد الإلكتروني" class="input-field"/>

    <div class="password-wrapper">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="كلمة المرور" class="input-field"/>
      <span class="toggle" @click="showPassword = !showPassword">{{ showPassword ? "🙈" : "👁️" }}</span>
    </div>

    <button :disabled="loading" @click="handleLogin" class="btn-baby">
      {{ loading ? "يتم تسجيل الدخول..." : "تسجيل الدخول" }}
    </button>

    <p class="toregist">ليس لديك حساب؟ <router-link to="/register">سجل الآن</router-link></p>
  </div>
</div>
</template>

<style scoped>
:root {
  --bg: #fff7fa;
  --card-bg: #fff;
  --primary: #f8a5c2;
  --primary-dark: #e75480;
  --text: #2c1b22;
  --muted: #a16b7c;
}

body.dark-mode {
  --bg: #1a0f14;
  --card-bg: #2a1820;
  --primary: #ff8fb1;
  --primary-dark: #ff4d88;
  --text: #fff;
  --muted: #ffd6e2;
}

body{
  background: var(--bg);
  color: var(--text);
  font-family:"Poppins",sans-serif;
  transition:0.3s ease;
}

.login-container{
  min-height:80vh;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:20px;
}

.card-login{
  width:100%;
  max-width:400px;
  background: var(--card-bg);
  padding:30px 25px;
  border-radius:20px;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  text-align:center;
}

.title{font-size:28px;font-weight:700;margin-bottom:20px;color:var(--primary);}
.input-field{width:100%;padding:12px 15px;margin-bottom:15px;border-radius:10px;border:1px solid #ccc;font-size:16px;}

.password-wrapper{position:relative;}
.password-wrapper .toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;}

.btn-baby{
  width:100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color:white;
  padding:12px;
  border:none;
  border-radius:12px;
  font-size:16px;
  font-weight:500;
  cursor:pointer;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.btn-baby:hover{transform:scale(1.05);opacity:0.9;}

.error{color:red;font-weight:500;margin-bottom:10px;}
.toregist{font-size:14px;color:var(--text);margin-top:10px;}

@media (max-width:480px){
  .card-login{padding:20px 15px;}
  .input-field{font-size:15px;padding:14px 12px;}
  .btn-baby{font-size:15px;padding:14px;}
  .title{font-size:24px;}
}
</style>