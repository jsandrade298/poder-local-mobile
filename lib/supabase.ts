import "react-native-url-polyfill/dist/polyfill";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

/**
 * Adaptador de storage usando expo-secure-store
 * Armazena tokens de autenticação de forma segura no dispositivo
 */
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn("SecureStore setItem error:", error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn("SecureStore removeItem error:", error);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Supabase URL ou Anon Key não configuradas.\n" +
    "Crie um arquivo .env com:\n" +
    "EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\n" +
    "EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Importante para RN: não tentar detectar URL
  },
});
