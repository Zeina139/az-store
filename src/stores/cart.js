import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

let quantityTimeouts = {};

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
    removingIds: [],
  }),

  getters: {
    total(state) {
      return state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
    },
  },

  actions: {
    async loadCart() {
      this.loading = true;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        this.items = [];
        this.loading = false;
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          id,
          quantity,
          product:products(id, name, price, image)
        `,
        )
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
        this.items = [];
      } else {
        this.items = data;
      }

      this.loading = false;
    },

    async addToCart(product, quantity = 1) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const productId = typeof product === "object" ? product.id : product;

      const existing = this.items.find((item) => item.product.id === productId);

      if (existing) {
        existing.quantity += quantity;
        try {
          await supabase
            .from("cart")
            .update({ quantity: existing.quantity })
            .eq("id", existing.id);
        } catch {
          existing.quantity -= quantity;
        }
      } else {
        const tempItem = { id: Date.now(), quantity, product };
        this.items.push(tempItem);

        try {
          const { data } = await supabase
            .from("cart")
            .insert({
              product_id: productId,
              quantity,
              user_id: user.id,
            })
            .select(`id, quantity, product:products(id, name, price, image)`)
            .single();

          const index = this.items.findIndex((i) => i.id === tempItem.id);
          if (index !== -1) this.items[index] = data;
        } catch {
          this.items = this.items.filter((i) => i.id !== tempItem.id);
        }
      }
    },

    async removeFromCart(cartId) {
      const index = this.items.findIndex((i) => i.id === cartId);
      if (index === -1) return;

      const removedItem = this.items[index];
      this.removingIds.push(cartId);
      this.items.splice(index, 1);

      try {
        await supabase.from("cart").delete().eq("id", cartId);
      } catch {
        this.items.splice(index, 0, removedItem);
      } finally {
        this.removingIds = this.removingIds.filter((id) => id !== cartId);
      }
    },

    async updateQuantity(cartId, quantity) {
      if (quantity < 1) return;

      const item = this.items.find((i) => i.id === cartId);
      if (!item) return;

      const oldQuantity = item.quantity;
      item.quantity = quantity;

      clearTimeout(quantityTimeouts[cartId]);

      quantityTimeouts[cartId] = setTimeout(async () => {
        try {
          await supabase.from("cart").update({ quantity }).eq("id", cartId);
        } catch {
          item.quantity = oldQuantity;
        }
      }, 400);
    },

    async clearCart() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const oldItems = [...this.items];
      this.items = [];

      try {
        await supabase.from("cart").delete().eq("user_id", user.id);
      } catch {
        this.items = oldItems;
      }
    },
  },
});
