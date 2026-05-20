import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CartView from "../views/CartView.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import ProductDetails from "../views/ProductDetails.vue";
import Checkout from "../views/Checkout.vue";
import OrderSuccess from "../views/OrderSuccess.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import MyOrders from "@/views/MyOrders.vue";

import AdminLayout from "../views/Layout/AdminLayout.vue";
import AdminDashboard from "../views/Admin/AdminDashboard.vue";
import AdminProduct from "@/views/Admin/AdminProduct.vue";
import AdminOrders from "@/views/Admin/AdminOrders.vue";

import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomeView },
    { path: "/cart", component: CartView },
    { path: "/about", component: About },
    { path: "/contact", component: Contact },
    { path: "/product/:id", component: ProductDetails },

    { path: "/checkout", component: Checkout, meta: { requiresAuth: true } },
    { path: "/myorders", component: MyOrders, meta: { requiresAuth: true } },

    { path: "/success", component: OrderSuccess },
    { path: "/register", component: RegisterView },
    { path: "/login", component: LoginView },

    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: "", component: AdminDashboard },
        { path: "products", component: AdminProduct },
        { path: "orders", component: AdminOrders },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.user.value && !auth.loading.value) {
    await auth.init();
  }

  if (to.meta.requiresAuth && !auth.user.value) {
    return `/login?redirect=${to.fullPath}`;
  }

  if (to.meta.requiresAdmin && auth.role.value !== "admin") {
    return "/";
  }
});
export default router;
