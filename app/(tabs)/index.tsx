import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  ChevronRight,
  Bell,
} from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Feedback";
import { PageHeader } from "@/components/layout";
import { Colors, Shadow, Radius, Spacing, StatusColors } from "@/constants/theme";
import { useState } from "react";

/* ────────────────────────── KPI Card ────────────────────────── */
function KPICard({
  label,
  value,
  icon: Icon,
  accent,
  description,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent: string;
  description: string;
}) {
  return (
    <View
      style={{
        minWidth: 130,
        backgroundColor: Colors.card,
        borderRadius: Radius.md,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border.DEFAULT,
        ...Shadow.sm,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: accent,
          borderTopLeftRadius: Radius.md,
          borderTopRightRadius: Radius.md,
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Inter_600SemiBold",
            color: Colors.text.muted,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: `${accent}15`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={accent} strokeWidth={2} />
        </View>
      </View>
      <Text
        style={{
          fontSize: 26,
          fontFamily: "Inter_800ExtraBold",
          color: Colors.text.DEFAULT,
          marginTop: 6,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Inter_400Regular",
          color: Colors.text.muted,
          marginTop: 2,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

/* ────────────────────────── Overdue Card ────────────────────────── */
function OverdueCard({
  label,
  value,
  color,
  bg,
  border,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: Radius.sm,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Text style={{ fontSize: 22, fontFamily: "Inter_800ExtraBold", color }}>
        {value}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          color,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/* ────────────────────────── Dashboard Screen ────────────────────────── */
export default function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Buscar KPIs
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      const [demandasRes, municipeRes, statusRes] = await Promise.all([
        supabase.from("demandas").select("id, status, data_prazo", { count: "exact" }),
        supabase.from("municipes").select("id", { count: "exact" }),
        supabase
          .from("demanda_status")
          .select("slug, nome, cor")
          .eq("ativo", true)
          .order("ordem"),
      ]);

      const demandas = demandasRes.data || [];
      const totalDemandas = demandasRes.count || 0;
      const totalMunicipes = municipeRes.count || 0;

      // Slugs de status "concluídos"
      const slugsConcluidas = ["concluida", "resolvida", "atendida", "finalizada"];
      const demConcluidas = demandas.filter((d) =>
        slugsConcluidas.includes(d.status || "")
      ).length;
      const taxaConclusao = totalDemandas > 0
        ? Math.round((demConcluidas / totalDemandas) * 100)
        : 0;

      // Em atraso
      const hoje = new Date().toISOString().split("T")[0];
      const slugsAbertos = ["solicitada", "em_andamento", "em_analise", "encaminhada"];
      const emAtraso = demandas.filter(
        (d) =>
          d.data_prazo &&
          d.data_prazo < hoje &&
          slugsAbertos.includes(d.status || "")
      );

      const abertas = demandas.filter((d) =>
        slugsAbertos.includes(d.status || "")
      ).length;

      // Distribuição por status
      const statusCount: Record<string, number> = {};
      demandas.forEach((d) => {
        const s = d.status || "desconhecido";
        statusCount[s] = (statusCount[s] || 0) + 1;
      });

      const statusDistribuicao = (statusRes.data || []).map((s) => ({
        slug: s.slug,
        nome: s.nome,
        cor: s.cor,
        count: statusCount[s.slug] || 0,
      }));

      // Atrasos por faixa
      const diasAtraso = (prazo: string) => {
        const diff = new Date().getTime() - new Date(prazo).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
      };
      const atraso30 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 30).length;
      const atraso60 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 60).length;
      const atraso90 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 90).length;

      return {
        totalDemandas,
        totalMunicipes,
        abertas,
        taxaConclusao,
        emAtraso: emAtraso.length,
        atraso30,
        atraso60,
        atraso90,
        statusDistribuicao,
      };
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    setRefreshing(false);
  };

  if (isLoading) return <Loading message="Carregando dashboard..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader
        title="Visão Geral"
        subtitle="Métricas e demandas em tempo real"
        right={
          <Pressable
            onPress={() => {/* TODO: notificações */}}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: Colors.muted,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: Colors.border.DEFAULT,
            }}
          >
            <Bell size={18} color={Colors.text.secondary} />
          </Pressable>
        }
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.page }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />}
        showsVerticalScrollIndicator={false}
      >
        {/* KPIs horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 10 }}
        >
          <KPICard label="Total" value={kpis?.totalDemandas ?? 0} icon={FileText} accent={Colors.primary.DEFAULT} description="demandas" />
          <KPICard label="Abertas" value={kpis?.abertas ?? 0} icon={Clock} accent={Colors.warning.DEFAULT} description="aguardando" />
          <KPICard label="Em atraso" value={kpis?.emAtraso ?? 0} icon={AlertTriangle} accent={Colors.destructive.DEFAULT} description="passaram prazo" />
          <KPICard label="Conclusão" value={`${kpis?.taxaConclusao ?? 0}%`} icon={TrendingUp} accent={Colors.success.DEFAULT} description="taxa atendimento" />
          <KPICard label="Munícipes" value={kpis?.totalMunicipes ?? 0} icon={Users} accent="#8B5CF6" description="cadastrados" />
        </ScrollView>

        {/* Status distribution */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <Card>
            <CardContent>
              <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginBottom: 16 }}>
                Demandas por Status
              </Text>
              <View style={{ gap: 10 }}>
                {kpis?.statusDistribuicao?.map((s) => (
                  <View key={s.slug} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: s.cor }} />
                    <Text style={{ flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.secondary }}>
                      {s.nome}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.text.DEFAULT }}>
                      {s.count}
                    </Text>
                    {/* Barra proporcional */}
                    <View style={{ width: 60, height: 6, backgroundColor: Colors.muted, borderRadius: 3 }}>
                      <View
                        style={{
                          height: 6,
                          backgroundColor: s.cor,
                          borderRadius: 3,
                          width: `${kpis!.totalDemandas > 0 ? (s.count / kpis!.totalDemandas) * 100 : 0}%`,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Em atraso */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card>
            <CardContent>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={16} color={Colors.destructive.DEFAULT} />
                  <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT }}>
                    Em Atraso
                  </Text>
                </View>
                <Badge
                  label={String(kpis?.emAtraso ?? 0)}
                  color="#FFFFFF"
                  bg={Colors.destructive.DEFAULT}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <OverdueCard label="30+ dias" value={kpis?.atraso30 ?? 0} color="#D97706" bg="#FEF3C7" border="#FDE68A" />
                <OverdueCard label="60+ dias" value={kpis?.atraso60 ?? 0} color="#EA580C" bg="#FFF7ED" border="#FED7AA" />
                <OverdueCard label="90+ dias" value={kpis?.atraso90 ?? 0} color="#DC2626" bg="#FEF2F2" border="#FECACA" />
              </View>
              {/* Link para ver demandas em atraso */}
              {(kpis?.emAtraso ?? 0) > 0 && (
                <Pressable
                  onPress={() => router.push("/(tabs)/demandas?atraso=overdue")}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 14, gap: 4 }}
                >
                  <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.destructive.DEFAULT }}>
                    Ver todas em atraso
                  </Text>
                  <ChevronRight size={14} color={Colors.destructive.DEFAULT} />
                </Pressable>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
