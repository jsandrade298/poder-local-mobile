import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { Colors, Shadow } from "@/constants/theme";


type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; bgPressed: string; text: string; border?: string }> = {
  primary: { bg: Colors.primary.DEFAULT, bgPressed: Colors.primary.dark, text: "#FFFFFF" },
  secondary: { bg: Colors.secondary.DEFAULT, bgPressed: Colors.secondary.dark, text: "#FFFFFF" },
  outline: { bg: "transparent", bgPressed: Colors.muted, text: Colors.text.DEFAULT, border: Colors.border.DEFAULT },
  ghost: { bg: "transparent", bgPressed: Colors.muted, text: Colors.text.secondary },
  destructive: { bg: Colors.destructive.DEFAULT, bgPressed: "#DC2626", text: "#FFFFFF" },
};

const sizeStyles: Record<ButtonSize, { paddingH: number; paddingV: number; fontSize: number; radius: number }> = {
  sm: { paddingH: 12, paddingV: 8, fontSize: 13, radius: 8 },
  md: { paddingH: 16, paddingV: 12, fontSize: 14, radius: 10 },
  lg: { paddingH: 20, paddingV: 14, fontSize: 16, radius: 12 },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  style,
  onPress,
  disabled,
  ...rest
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const handlePress = (e: any) => {
    
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? v.bgPressed : v.bg,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderRadius: s.radius,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          ...Shadow.sm,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: v.text,
              fontSize: s.fontSize,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: -0.1,
            }}
          >
            {title}
          </Text>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}
