<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useCartStore } from "@/stores/cart"
import { supabase } from "@/lib/supabase"

const cartStore = useCartStore()

const name = ref("")
const phone = ref("")
const address = ref("")
const loading = ref(false)
const total = computed(() => cartStore.total)
const phoneError = ref(false)
const phoneErrorMessage = ref("")

onMounted(() => {
  cartStore.loadCart()
})


function arabicToEnglishNumbers(str) {
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  const english = '0123456789';
  return str.replace(/[٠-٩]/g, d => english[arabic.indexOf(d)]);
}


function validatePhone(number) {
  const num = arabicToEnglishNumbers(number);
  const phoneRegex = /^09\d{8}$/; 
  return phoneRegex.test(num);
}


watch(phone, (newVal) => {
  phone.value = arabicToEnglishNumbers(newVal)
  if (!phone.value) {
    phoneError.value = false
    phoneErrorMessage.value = ""
    return
  }
  if (!validatePhone(phone.value)) {
    phoneError.value = true
    phoneErrorMessage.value = "رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09"
  } else {
    phoneError.value = false
    phoneErrorMessage.value = ""
  }
})

const placeOrder = async () => {
  if (loading.value) return

  if (!name.value || !phone.value || !address.value) {
    alert("الرجاء تعبئة جميع الحقول")
    return
  }

  if (phoneError.value) {
    alert("رقم الهاتف غير صحيح ❌")
    return
  }

  if (!cartStore.items.length) {
    alert("السلة فارغة")
    return
  }

  loading.value = true

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    alert("يجب تسجيل الدخول")
    loading.value = false
    return
  }

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: total.value,
        name: name.value,
        phone: phone.value,
        address: address.value,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    const items = cartStore.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items)

    if (itemsError) throw itemsError

    await cartStore.clearCart(user.id)

    alert("تم إنشاء الطلب بنجاح 🎉")

    name.value = ""
    phone.value = ""
    address.value = ""
    phoneError.value = false
    phoneErrorMessage.value = ""

  } catch (err) {
    console.error(err)
    alert("حدث خطأ أثناء إنشاء الطلب ❌")
  } finally {
    loading.value = false
  }
}
</script>

<template>
<div class="checkout-container">
  <h1 class="checkout-title">إتمام الطلب</h1>
  <div class="checkout-grid">
    <!-- FORM -->
    <div class="checkout-form">
      <h3>معلومات العميل</h3>
      <input v-model="name" placeholder="الاسم الكامل"/>

      <div style="position:relative">
        <input
          v-model="phone"
          placeholder="رقم الهاتف"
          :class="{ 'input-error': phoneError }"
        />
        <span v-if="phoneError" class="error-text">{{ phoneErrorMessage }}</span>
      </div>

      <textarea v-model="address" placeholder="العنوان"></textarea>
    </div>

    <div class="order-summary">
      <h3>ملخص الطلب</h3>
      <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
        <span>{{ item.product.name }}</span>
        <span>{{ item.quantity }} × {{ item.product.price }}</span>
      </div>
      <hr>
      <div class="total">
        <span>المجموع</span>
        <strong>{{ total }} ل.س</strong>
      </div>
      <button class="order-btn" @click="placeOrder" :disabled="loading">
        <span v-if="loading">جاري المعالجة...</span>
        <span v-else>تأكيد الطلب</span>
      </button>
    </div>
  </div>
</div>
</template>


<style>
.checkout-container{
  max-width:1100px;
  margin:auto;
  padding:40px 20px;
}

.checkout-title{
  font-size:32px;
  font-weight:700;
  margin-bottom:30px;
  text-align:center;
}


.checkout-grid{
  display:grid;
  grid-template-columns:2fr 1fr;
  gap:30px;
}


.checkout-form{
  background:var(--card-bg);
  padding:25px;
  border-radius:14px;
  box-shadow:0 5px 18px rgba(0,0,0,0.06);
  display:flex;
  flex-direction:column;
  gap:15px;
}

.checkout-form input,
.checkout-form textarea,
.checkout-form select{
  padding:12px;
  border-radius:8px;
  border:1px solid #ddd;
}


.checkout-form input.input-error {
  border-color: red !important;
  background-color: #ffe6e6;
}

.error-text {
  color: red;
  font-size: 12px;
  position: absolute;
  bottom: -18px;
  left: 0;
}


.order-summary{
  background:var(--card-bg);
  padding:25px;
  border-radius:14px;
  box-shadow:0 5px 18px rgba(0,0,0,0.06);
}

.summary-item{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  font-size:14px;
}

.total{
  display:flex;
  justify-content:space-between;
  font-size:18px;
  margin:15px 0;
}


.order-btn{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  background:var(--primary-dark);
  color:white;
  font-weight:600;
  cursor:pointer;
  transition:.25s;
}

.order-btn:hover{
  transform:scale(1.03);
}

@media (max-width:900px){
  .checkout-grid{
    grid-template-columns:1fr;
  }
}
</style>