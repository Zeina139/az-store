<script setup>
import { useRouter } from "vue-router"

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(["close"])

const router = useRouter()

const goLogin = () => {
  router.push("/login")
}

const goRegister = () => {
  router.push("/register")
}
</script>

<template>
  <div v-if="show" class="overlay">

    <div class="modal-box">

      <h3>🔒 تسجيل الدخول مطلوب</h3>

      <p>
        يجب تسجيل الدخول أو إنشاء حساب لإضافة المنتجات إلى السلة وإتمام الطلب
      </p>

      <div class="actions">
        <button class="btn-login" @click="goLogin">
          تسجيل دخول
        </button>

        <button class="btn-register" @click="goRegister">
          إنشاء حساب
        </button>
      </div>

      <button class="close" @click="$emit('close')">×</button>

    </div>

  </div>
</template>

<style scoped>
.overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.5);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:999;
}

.modal-box{
  background:white;
  padding:30px;
  border-radius:20px;
  width:90%;
  max-width:400px;
  text-align:center;
  position:relative;
  animation:fadeIn .3s ease;
}

h3{
  margin-bottom:10px;
}

p{
  font-size:14px;
  margin-bottom:20px;
  color:#555;
}

.actions{
  display:flex;
  gap:10px;
  justify-content:center;
}

.btn-login{
  background:#3d909e;
  color:white;
  border:none;
  padding:10px 15px;
  border-radius:10px;
  cursor:pointer;
}

.btn-register{
  background:#c16a17;
  color:white;
  border:none;
  padding:10px 15px;
  border-radius:10px;
  cursor:pointer;
}

.close{
  position:absolute;
  top:10px;
  right:15px;
  border:none;
  background:none;
  font-size:20px;
  cursor:pointer;
}

@keyframes fadeIn{
  from{opacity:0; transform:scale(0.9);}
  to{opacity:1; transform:scale(1);}
}
</style>