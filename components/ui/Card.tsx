import { View, Pressable, type ViewStyle } from "react-native";
import { Colors, Radius } from "@/constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  accentColor?: string;
  flat?: boolean;
}

export function Card({ children, style, onPress, accentColor, flat }: CardProps) {
  // Shadow wrapper (cannot have overflow:hidden on Android or shadows get clipped)
  const shadowStyle: ViewStyle = {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    ...(flat
      ? {}
      : {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }),
    ...style,
  };

  // Inner container with border and overflow hidden for accent
  const innerStyle: ViewStyle = {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: flat ? "transparent" : Colors.border.DEFAULT,
    overflow: "hidden",
    backgroundColor: Colors.card,
  };

  const content = accentColor ? (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: 4, backgroundColor: accentColor }} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  ) : (
    children
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [shadowStyle, pressed && { opacity: 0.93 }]}>
        <View style={innerStyle}>{content}</View>
      </Pressable>
    );
  }

  return (
    <View style={shadowStyle}>
      <View style={innerStyle}>{content}</View>
    </View>
  );
}

export function CardContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16 }, style]}>{children}</View>;
}
