import { View, Text, Pressable, TextInput, type ViewStyle } from "react-native";
import { Search, Filter, Plus } from "lucide-react-native";
import { Colors, Shadow, Radius, Spacing } from "@/constants/theme";
import { Badge } from "@/components/ui/Badge";
import { StatusColors, PrioridadeColors, RotaStatusColors } from "@/constants/theme";
import * as Haptics from "expo-haptics";

/* ═══════════════════════════════════════════
   PageHeader — título + subtítulo + ações
   ═══════════════════════════════════════════ */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function PageHeader({ title, subtitle, right, style }: PageHeaderProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.background,
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.DEFAULT,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: right ? 12 : 0 }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: "Inter_700Bold",
              color: Colors.text.DEFAULT,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: Colors.text.muted,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {right}
      </View>
    </View>
  );
}

/* ═══════════════════════════════════════════
   SearchBar — barra de busca com filtro
   ═══════════════════════════════════════════ */

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  style?: ViewStyle;
}

export function SearchBar({
  placeholder = "Buscar...",
  value,
  onChangeText,
  onFilterPress,
  showFilter = true,
  style,
}: SearchBarProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          gap: 10,
          backgroundColor: Colors.background,
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.muted,
          borderRadius: Radius.sm,
          borderWidth: 1,
          borderColor: Colors.border.DEFAULT,
          paddingHorizontal: 14,
          gap: 10,
        }}
      >
        <Search size={16} color={Colors.text.muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          style={{
            flex: 1,
            paddingVertical: 10,
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: Colors.text.DEFAULT,
          }}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {showFilter && onFilterPress && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onFilterPress();
          }}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: Radius.sm,
            borderWidth: 1,
            borderColor: Colors.border.DEFAULT,
            backgroundColor: pressed ? Colors.muted : Colors.background,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Filter size={18} color={Colors.text.secondary} />
        </Pressable>
      )}
    </View>
  );
}

/* ═══════════════════════════════════════════
   FAB — Floating Action Button
   ═══════════════════════════════════════════ */

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function FAB({ onPress, icon, style }: FABProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        {
          position: "absolute",
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? Colors.primary.dark : Colors.primary.DEFAULT,
          ...Shadow.lg,
          shadowColor: Colors.primary.DEFAULT,
          elevation: 8,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      {icon || <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />}
    </Pressable>
  );
}

/* ═══════════════════════════════════════════
   StatusBadge — badge automático por slug
   ═══════════════════════════════════════════ */

export function StatusBadge({ status, type = "demanda" }: { status: string; type?: "demanda" | "rota" }) {
  const map = type === "rota" ? RotaStatusColors : StatusColors;
  const config = map[status] || { color: Colors.text.muted, bg: Colors.muted, label: status };
  return <Badge label={config.label} color={config.color} bg={config.bg} />;
}

export function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const config = PrioridadeColors[prioridade] || {
    color: Colors.text.muted,
    bg: Colors.muted,
    label: prioridade,
  };
  return <Badge label={config.label} color={config.color} bg={config.bg} />;
}
