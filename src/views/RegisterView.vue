<script setup>
import { ref } from "vue"
import { supabase } from "../lib/supabase"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const message = ref("")
const errorMsg = ref("")
const showPassword = ref(false)
const showConfirm = ref(false)

const handleRegister = async () => {
  errorMsg.value = ""
  message.value = ""

  if (!email.value || !password.value || !confirmPassword.value) {
    errorMsg.value = "يرجى تعبئة جميع الحقول"
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "كلمتا المرور غير متطابقتين"
    return
  }

  loading.value = true
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { emailRedirectTo: `${window.location.origin}/login` }
  })
  loading.value = false

  if (error) {
    errorMsg.value = "حدث خطأ أثناء إنشاء الحساب"
    return
  }

  message.value = `🎉 تم إنشاء الحساب بنجاح!
📩 تحقق من بريدك الإلكتروني: ${email.value}
اضغط على الرابط لتفعيل الحساب ثم سجل الدخول.`

  email.value = ""
  password.value = ""
  confirmPassword.value = ""

  setTimeout(() => router.push("/login"), 4000)
}
</script>

<template>
<div class="register-container">
  <div class="card-register">

    <h2 class="title">إنشاء حساب</h2>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <input v-model="email" type="email" placeholder="البريد الإلكتروني" class="input-field"/>

    <div class="password-wrapper">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="كلمة المرور" class="input-field"/>
      <span class="toggle" @click="showPassword = !showPassword">{{ showPassword ? "🙈" : "👁️" }}</span>
    </div>

    <div class="password-wrapper">
      <input :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword" placeholder="تأكيد كلمة المرور" class="input-field"/>
      <span class="toggle" @click="showConfirm = !showConfirm">{{ showConfirm ? "🙈" : "👁️" }}</span>
    </div>

    <button :disabled="loading" @click="handleRegister" class="btn-baby">
      {{ loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب" }}
    </button>

    <p class="note">بعد إنشاء الحساب، تحقق من بريدك الإلكتروني ثم قم بتسجيل الدخول</p>
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

body {
  background: var(--bg);
  color: var(--text);
  font-family: "Poppins", sans-serif;
  transition: 0.3s ease;
}

.register-container{
  min-height: 80vh;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:20px;
}

.card-register{
  width:100%;
  max-width:400px;
  background: var(--card-bg);
  padding:30px 25px;
  border-radius:20px;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  text-align:center;
}

.title{
  font-size:28px;
  font-weight:700;
  margin-bottom:20px;
  color: var(--primary);
}

.input-field{
  width:100%;
  padding:12px 15px;
  margin-bottom:15px;
  border-radius:10px;
  border:1px solid #ccc;
  font-size:16px;
}

.password-wrapper{
  position: relative;
}
.password-wrapper .toggle{
  position:absolute;
  right:12px;
  top:50%;
  transform:translateY(-50%);
  cursor:pointer;
}

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
.btn-baby:hover{
  transform: scale(1.05);
  opacity:0.9;
}

.success{color:green;font-weight:500;margin-bottom:10px;}
.error{color:red;font-weight:500;margin-bottom:10px;}
.note{font-size:14px;color:var(--muted);margin-top:10px;}

@media (max-width:480px){
  .card-register{padding:20px 15px;}
  .input-field{font-size:15px;padding:14px 12px;}
  .btn-baby{font-size:15px;padding:14px;}
  .title{font-size:24px;}
}
</style>