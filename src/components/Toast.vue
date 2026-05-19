<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  message: String,
  type: String, // success | error
  show: Boolean
})

const visible = ref(false)

watch(() => props.show, (val) => {
  if (val) {
    visible.value = true
    setTimeout(() => visible.value = false, 2500)
  }
})
</script>

<template>
  <div v-if="visible" :class="['toast', type]">
    {{ message }}
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 14px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 9999;
  animation: slideIn 0.4s ease;
}

.success {
  background: #3d909e;
}

.error {
  background: #e74c3c;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>