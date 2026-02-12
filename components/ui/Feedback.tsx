import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/theme";

/** Indicador de loading padrão */
export function Loading({ message = "Carregando..." }: { message?: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.page,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: Colors.text.muted,
        }}
      >
        {message}
      </Text>
    </View>
  );
}

/** Tela vazia quando não há dados */
export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
        gap: 8,
      }}
    >
      {icon && (
        <Text style={{ fontSize: 48, marginBottom: 8 }}>{icon}</Text>
      )}
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_600SemiBold",
          color: Colors.text.DEFAULT,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter_400Regular",
            color: Colors.text.muted,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {subtitle}
        </Text>
      )}
      {action && <View style={{ marginTop: 16 }}>{action}</View>}
    </View>
  );
}
