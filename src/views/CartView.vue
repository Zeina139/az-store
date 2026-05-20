<!--CartView-->
<script setup>
import { onMounted, computed } from "vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.loadCart();
});

// حساب المجموع
const total = computed(() =>
  cartStore.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
);
function onQuantityChange(item, event) {
  const value = parseInt(event.target.value);

  if (!value || value < 1) return;

  cartStore.updateQuantity(item.id, value);
}
function handleClearCart() {
  if (!confirm("هل أنت متأكد من إفراغ السلة؟")) return

  cartStore.clearCart()
}
</script>

<template>
  <div class="cart-page">
    <h1>سلة مشترياتي</h1>

    <div v-if="cartStore.loading" class="loading">Loading...</div>

    <div v-else>
      <div v-if="cartStore.items.length" class="cart-list">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-card">
          <img :src="item.product.image" class="cart-img" />

          <div class="cart-info">
            <h3>{{ item.product.name }}</h3>
            <p class="price">ل.س {{ item.product.price }}</p>

            <div class="quantity">
              <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">-</button>
<input
  type="number"
  :value="item.quantity"
  min="1"
  @change="onQuantityChange(item, $event)"
/>
              <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
            </div>

            <p class="total">السعر الكلي : ل.س {{ item.product.price * item.quantity }}</p>

<button
  @click="cartStore.removeFromCart(item.id)"
  :disabled="cartStore.removingIds.includes(item.id)"
  class="btn-delete"
>
  <span v-if="cartStore.removingIds.includes(item.id)">...</span>
  <span v-else>إزالة</span>
</button>
          </div>
        </div>
<div class="cart-actions">
  <button class="btn-clear" @click="handleClearCart">
    إفراغ السلة
  </button>
</div>
        <div class="cart-total">
          <h3>السعر الكلي: ل.س {{ total }}</h3>
          <router-link to="/checkout">
          <button class="btn-checkout" @click="">إتمام الطلب</button>
          </router-link>
        </div>
      
      </div>

      <div v-else class="empty-cart">
        <p>سلتك فارغة 😢</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.cart-page {
  padding: 15px;
  max-width: 700px;
  margin: auto;
}

h1 {
  text-align: center;
  font-size: 28px;
  color: var(--primary-dark);
  margin-bottom: 20px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* بطاقة المنتج */
.cart-card {
  display: flex;
  gap: 15px;
  background: var(--card-bg);
  border-radius: 15px;
  padding: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: 0.3s ease;
}

.cart-card:hover {
  transform: translateY(-3px);
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}


.cart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cart-info h3 {
  margin: 0;
  font-size: 18px;
  color: var(--primary-dark);
}
.cart-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-clear {
  background: #555;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-clear:hover {
  background: #333;
  transform: scale(1.05);
}
.price, .total {
  font-weight: 600;
  color: var(--primary-dark);
}

.quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantity button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: var(--primary);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.quantity input {
  width: 50px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 4px;
}

/* ازرار */
.btn-delete {
  margin-top: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-delete:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

.cart-total {
  margin-top: 20px;
  text-align: right;
}

.btn-checkout {
  margin-top: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  font: 1.3em sans-serif;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-checkout:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: var(--muted);
}

/* Dark Mode */
body.dark-mode .cart-card {
  background: var(--card-bg);
  color: var(--text);
}

body.dark-mode .cart-total h3,
body.dark-mode .cart-info h3,
body.dark-mode .price,
body.dark-mode .total {
  color: var(--primary);
}

body.dark-mode .btn-checkout {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}
</style>