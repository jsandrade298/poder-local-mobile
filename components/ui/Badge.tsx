import { View, Text, type ViewStyle } from "react-native";
import { Colors } from "@/constants/theme";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: "sm" | "md";
  style?: ViewStyle;
}

export function Badge({
  label,
  color = Colors.text.secondary,
  bg = Colors.muted,
  size = "sm",
  style,
}: BadgeProps) {
  const isSmall = size === "sm";
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 4,
          borderRadius: 6,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        style={{
          color,
          fontSize: isSmall ? 10 : 12,
          fontFamily: "Inter_600SemiBold",
          letterSpacing: 0.2,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

/** Badge de contagem (número dentro de círculo) */
export function CountBadge({
  count,
  color = "#FFFFFF",
  bg = Colors.destructive.DEFAULT,
}: {
  count: number;
  color?: string;
  bg?: string;
}) {
  if (count <= 0) return null;
  return (
    <View
      style={{
        backgroundColor: bg,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
      }}
    >
      <Text
        style={{
          color,
          fontSize: 10,
          fontFamily: "Inter_700Bold",
          lineHeight: 12,
        }}
      >
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}
