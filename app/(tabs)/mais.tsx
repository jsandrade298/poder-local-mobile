import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Columns,
  Bot,
  Calendar,
  Target,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { PageHeader } from "@/components/layout";
import { Colors, Radius, Shadow, Spacing } from "@/constants/theme";
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
  {
    icon: Columns,
    iconColor: Colors.primary.DEFAULT,
    iconBg: Colors.primary.bg,
    label: "Kanban",
    desc: "Quadro de acompanhamento",
    route: "/kanban",
  },
  {
    icon: Bot,
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
    label: "Assessor IA",
    desc: "Chat inteligente",
    route: "/assessor-ia",
  },
  {
    icon: Calendar,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    label: "Solicitar Agenda",
    desc: "Agendar compromissos",
    route: "/agenda",
  },
  {
    icon: Target,
    iconColor: Colors.success.DEFAULT,
    iconBg: Colors.success.bg,
    label: "Plano de Ação",
    desc: "Projetos e metas",
    route: "/plano-acao",
  },
  {
    icon: BarChart3,
    iconColor: "#EC4899",
    iconBg: "#FDF2F8",
    label: "Balanço",
    desc: "Relatórios de demandas",
    route: "/balanco",
  },
];

export default function MaisScreen() {
  const router = useRouter();
  const { user, profile, tenant, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader title="Menu" />
      <ScrollView style={{ flex: 1, backgroundColor: Colors.page }} showsVerticalScrollIndicator={false}>
        {/* User info */}
        <View
          style={{
            backgroundColor: Colors.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border.DEFAULT,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Avatar name={profile?.nome || user?.email || "U"} size={50} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT }}>
                {profile?.nome || "Usuário"}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 1 }}>
                {user?.email}
              </Text>
              {tenant?.nome && (
                <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.primary.DEFAULT, marginTop: 2 }}>
                  {tenant.nome}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Funcionalidades */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.text.muted, letterSpacing: 0.5 }}>
            FUNCIONALIDADES
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: Colors.card,
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: Colors.border.DEFAULT,
            ...Shadow.sm,
            overflow: "hidden",
          }}
        >
          {mainItems.map((item, i) => (
            <Pressable
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: pressed ? Colors.muted : "transparent",
                borderBottomWidth: i < mainItems.length - 1 ? 1 : 0,
                borderBottomColor: Colors.border.light,
              })}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: item.iconBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <item.icon size={18} color={item.iconColor} strokeWidth={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text.DEFAULT }}>
                  {item.label}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                  {item.desc}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.text.muted} />
            </Pressable>
          ))}
        </View>

        {/* Conta */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.text.muted, letterSpacing: 0.5 }}>
            CONTA
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 40,
            backgroundColor: Colors.card,
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: Colors.border.DEFAULT,
            ...Shadow.sm,
            overflow: "hidden",
          }}
        >
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: pressed ? Colors.destructive.bg : "transparent",
            })}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: Colors.destructive.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogOut size={18} color={Colors.destructive.DEFAULT} strokeWidth={1.8} />
            </View>
            <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.destructive.DEFAULT }}>
              Sair da conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
