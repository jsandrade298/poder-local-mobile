import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Columns, Bot, Calendar, Target, BarChart3, LogOut, ChevronRight, User, Settings,
} from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { PageHeader } from "@/components/layout";
import { Colors, Radius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  icon: any;
  iconColor: string;
  iconBg: string;
  label: string;
  desc: string;
  route: string;
}

const mainItems: MenuItem[] = [
  { icon: Columns, iconColor: Colors.primary.DEFAULT, iconBg: Colors.primary.bg, label: "Kanban", desc: "Quadro de acompanhamento", route: "/kanban" },
  { icon: Bot, iconColor: "#8B5CF6", iconBg: "#F3F0FF", label: "Assessor IA", desc: "Chat inteligente", route: "/assessor-ia" },
  { icon: Calendar, iconColor: "#F59E0B", iconBg: "#FFFBEB", label: "Solicitar Agenda", desc: "Agendar compromissos", route: "/agenda" },
  { icon: Target, iconColor: Colors.success.DEFAULT, iconBg: Colors.success.bg, label: "Plano de Ação", desc: "Projetos e metas", route: "/plano-acao" },
  { icon: BarChart3, iconColor: "#EC4899", iconBg: "#FDF2F8", label: "Balanço", desc: "Relatórios de demandas", route: "/balanco" },
];

function MenuRow({ icon: Icon, iconColor, iconBg, label, desc, onPress, isLast }: {
  icon: any; iconColor: string; iconBg: string; label: string; desc?: string; onPress: () => void; isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: pressed ? "#F8FAFC" : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: Colors.border.light,
      })}
    >
      <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: iconBg, alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={iconColor} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text.DEFAULT }}>{label}</Text>
        {desc ? <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 1 }}>{desc}</Text> : null}
      </View>
      <ChevronRight size={16} color={Colors.text.muted} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}

export default function MaisScreen() {
  const router = useRouter();
  const { user, profile, tenant, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: async () => { await signOut(); } },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader title="Menu" />
      <ScrollView style={{ flex: 1, backgroundColor: Colors.page }} showsVerticalScrollIndicator={false}>
        {/* Gradient User Header */}
        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 12, borderRadius: 16, overflow: "hidden", elevation: 4, shadowColor: Colors.primary.DEFAULT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}>
          <LinearGradient
            colors={[Colors.primary.DEFAULT, "#6D5BDE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" }}>
                  {(profile?.nome || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>
                  {profile?.nome || "Usuário"}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                  {user?.email}
                </Text>
                {tenant?.nome ? (
                  <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
                    {tenant.nome}
                  </Text>
                ) : null}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Funcionalidades */}
        <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.text.muted, letterSpacing: 0.8 }}>
            FUNCIONALIDADES
          </Text>
        </View>
        <View style={{ marginLeft: 20, marginRight: 20, backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border.DEFAULT, elevation: 3, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, overflow: "hidden" }}>
          {mainItems.map((item, i) => (
            <MenuRow
              key={item.route}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBg={item.iconBg}
              label={item.label}
              desc={item.desc}
              onPress={() => router.push(item.route as any)}
              isLast={i === mainItems.length - 1}
            />
          ))}
        </View>

        {/* Conta */}
        <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.text.muted, letterSpacing: 0.8 }}>
            CONTA
          </Text>
        </View>
        <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 40, backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border.DEFAULT, elevation: 3, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, overflow: "hidden" }}>
          <MenuRow icon={User} iconColor={Colors.primary.DEFAULT} iconBg={Colors.primary.bg} label="Meu Perfil" onPress={() => {}} />
          <MenuRow icon={Settings} iconColor={Colors.text.secondary} iconBg={Colors.muted} label="Configurações" onPress={() => {}} />
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              flexDirection: "row" as const,
              alignItems: "center" as const,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: pressed ? Colors.destructive.bg : "transparent",
            })}
          >
            <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.destructive.bg, alignItems: "center", justifyContent: "center" }}>
              <LogOut size={18} color={Colors.destructive.DEFAULT} strokeWidth={1.8} />
            </View>
            <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.destructive.DEFAULT, marginLeft: 14 }}>
              Sair da conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
