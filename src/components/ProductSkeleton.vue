<template>
  <div class="skeleton-card">
    <div class="img"></div>
    <div class="text"></div>
    <div class="text small"></div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: #eee;
  border-radius: 18px;
  overflow: hidden;
  animation: pulse 1.5s infinite;
}

.img {
  height: 250px;
  background: #ddd;
}

.text {
  height: 15px;
  margin: 10px;
  background: #ccc;
  border-radius: 8px;
}

.small {
  width: 60%;
}

@keyframes pulse {
  0% { opacity: 0.6 }
  50% { opacity: 1 }
  100% { opacity: 0.6 }
}
</style>