import { ref } from "vue";
import { supabase } from "@/lib/supabase";

const user = ref(null);
const role = ref(null);
const loading = ref(true);

let initialized = false;

export function useAuthStore() {
  const init = async () => {
    if (initialized) return;
    initialized = true;

    loading.value = true;

    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user || null;

    if (user.value) {
      await loadRole();
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user || null;
      if (user.value) {
        await loadRole();
      } else {
        role.value = null;
      }
    });

    loading.value = false;
  };

  const loadRole = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.value.id)
      .single();

    role.value = profile?.role || null;
  };

  return { user, role, loading, init };
}
