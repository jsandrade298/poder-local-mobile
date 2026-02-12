import { View, Pressable, type ViewStyle } from "react-native";
import { Colors, Radius, Shadow } from "@/constants/theme";

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
    borderWidth: flat ? 0 : 1,
    borderColor: Colors.border.DEFAULT,
    ...(flat ? {} : Shadow.sm),
    ...(accentColor
      ? { borderLeftWidth: 3, borderLeftColor: accentColor }
      : {}),
    ...style,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.95, ...Shadow.md },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

/** Wrapper para padding interno consistente */
export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ padding: 16 }, style]}>{children}</View>;
}
