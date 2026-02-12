import { Stack } from "expo-router";
import { Colors } from "@/constants/theme";

export default function MunicipesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.page } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ presentation: "card" }} />
    </Stack>
  );
}
