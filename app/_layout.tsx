import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";

import "../global.css";

// Manter splash screen até as fontes carregarem
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      retry: 2,
    },
  },
});

/* ════════════════════════════════════════════
   Auth guard: redireciona baseado na sessão
   ════════════════════════════════════════════ */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Não logado e não está na tela de login → redirecionar
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // Logado mas está na tela de login → ir para home
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return <>{children}</>;
}

/* ════════════════════════════════════════════
   Root Layout
   ════════════════════════════════════════════ */
export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              {/* Telas push (sem tab bar) */}
              <Stack.Screen
                name="kanban"
                options={{
                  headerShown: true,
                  title: "Kanban",
                  presentation: "card",
                }}
              />
              <Stack.Screen
                name="assessor-ia"
                options={{
                  headerShown: false,
                  presentation: "card",
                }}
              />
              <Stack.Screen
                name="agenda"
                options={{
                  headerShown: true,
                  title: "Solicitar Agenda",
                  presentation: "card",
                }}
              />
              <Stack.Screen
                name="plano-acao"
                options={{
                  headerShown: true,
                  title: "Plano de Ação",
                  presentation: "card",
                }}
              />
              <Stack.Screen
                name="balanco"
                options={{
                  headerShown: true,
                  title: "Balanço de Demandas",
                  presentation: "card",
                }}
              />
            </Stack>
          </AuthGate>
          <StatusBar style="dark" />
          <Toast />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
