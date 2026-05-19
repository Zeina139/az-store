import { supabase } from "../lib/supabase";

// login
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// register
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// logout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
