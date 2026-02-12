import { View, Text, type ViewStyle } from "react-native";
import { getInitials, stringToColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function Avatar({ name, size = 44, color, style }: AvatarProps) {
  const bgColor = color || stringToColor(name);
  const initials = getInitials(name);
  const fontSize = size * 0.34;
  const borderRadius = size * 0.32; // Squircle-ish

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: `${bgColor}18`,
          borderWidth: 1.5,
          borderColor: `${bgColor}30`,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize,
          fontFamily: "Inter_700Bold",
          color: bgColor,
          letterSpacing: -0.3,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
