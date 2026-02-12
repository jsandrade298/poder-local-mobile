import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { Colors, Radius } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? Colors.destructive.DEFAULT
    : focused
    ? Colors.primary.DEFAULT
    : Colors.border.DEFAULT;

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter_500Medium",
            color: error ? Colors.destructive.DEFAULT : Colors.text.secondary,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={Colors.text.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          {
            backgroundColor: Colors.background,
            borderWidth: 1,
            borderColor,
            borderRadius: Radius.sm,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: Colors.text.DEFAULT,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: Colors.destructive.DEFAULT,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
