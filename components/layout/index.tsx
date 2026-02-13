import { View, Text, Pressable, TextInput, type ViewStyle } from "react-native";
import { Search, Filter, Plus } from "lucide-react-native";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { Badge } from "@/components/ui/Badge";
import { StatusColors, PrioridadeColors, RotaStatusColors } from "@/constants/theme";
import * as Haptics from "expo-haptics";

/* ═══ PageHeader ═══ */
export function PageHeader({ title, subtitle, right, style }: {
  title: string; subtitle?: string; right?: React.ReactNode; style?: ViewStyle;
}) {
  return (
    <View style={[{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.DEFAULT }, style]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, marginRight: right ? 12 : 0 }}>
          <Text style={{ fontSize: 24, fontFamily: "Inter_700Bold", color: Colors.text.DEFAULT, letterSpacing: -0.5 }}>{title}</Text>
          {subtitle ? <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 2 }}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

/* ═══ SearchBar ═══ */
export function SearchBar({ placeholder = "Buscar...", value, onChangeText, onFilterPress, showFilter = true, style }: {
  placeholder?: string; value: string; onChangeText: (t: string) => void; onFilterPress?: () => void; showFilter?: boolean; style?: ViewStyle;
}) {
  return (
    <View style={[{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.background }, style]}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: Colors.page, borderRadius: 10, borderWidth: 1, borderColor: Colors.border.DEFAULT, paddingHorizontal: 14 }}>
        <Search size={16} color={Colors.text.muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          style={{ flex: 1, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.text.DEFAULT, marginLeft: 10 }}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {showFilter && onFilterPress ? (
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onFilterPress(); }}
          style={{ width: 44, height: 44, borderRadius: 10, borderWidth: 1, borderColor: Colors.border.DEFAULT, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", marginLeft: 10 }}
        >
          <Filter size={18} color={Colors.text.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ═══ FAB ═══ */
export function FAB({ onPress, icon, style }: { onPress: () => void; icon?: React.ReactNode; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
      style={[{ position: "absolute", bottom: 24, right: 20, width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary.DEFAULT, shadowColor: Colors.primary.DEFAULT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }, style]}
    >
      {icon || <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />}
    </Pressable>
  );
}

/* ═══ Status Badges ═══ */
export function StatusBadge({ status, type = "demanda" }: { status: string; type?: "demanda" | "rota" }) {
  const map = type === "rota" ? RotaStatusColors : StatusColors;
  const config = map[status] || { color: Colors.text.muted, bg: Colors.muted, label: status };
  return <Badge label={config.label} color={config.color} bg={config.bg} />;
}

export function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const config = PrioridadeColors[prioridade] || { color: Colors.text.muted, bg: Colors.muted, label: prioridade };
  return <Badge label={config.label} color={config.color} bg={config.bg} />;
}
