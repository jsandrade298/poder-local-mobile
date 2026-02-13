import { View, Pressable, type ViewStyle } from "react-native";
import { Colors, Radius } from "@/constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  /** Cor da borda esquerda (ex: por status) */
  accentColor?: string;
  /** Variante sem borda/shadow (flat) */
  flat?: boolean;
}

export function Card({ children, style, onPress, accentColor, flat }: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: flat ? "transparent" : Colors.border.DEFAULT,
    overflow: "hidden" as const,
    ...(flat
      ? {}
      : {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }),
    ...style,
  };

  const inner = accentColor ? (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          width: 4,
          backgroundColor: accentColor,
        }}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  ) : (
    children
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.93, elevation: 5 },
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{inner}</View>;
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ padding: 16 }, style]}>{children}</View>;
}
