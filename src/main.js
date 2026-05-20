import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/theme.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");

import { useCartStore } from "./stores/cart";
const cart = useCartStore();
cart.loadCart();
