import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FileText, Clock, AlertTriangle, TrendingUp, Users, Bell,
} from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Feedback";
import { PageHeader } from "@/components/layout";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { Colors, StatusColors } from "@/constants/theme";
import { useState } from "react";

/* ── KPI Card ── */
function KPICard({
  label, value, icon: Icon, accent, description,
}: {
  label: string; value: string | number; icon: any; accent: string; description: string;
}) {
  return (
    <View
      style={{
        minWidth: 140,
        backgroundColor: Colors.card,
        borderRadius: 14,
        paddingTop: 18,
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: Colors.border.DEFAULT,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* Colored top bar */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: accent,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: Colors.text.muted, letterSpacing: 0.8, textTransform: "uppercase" }}>
          {label}
        </Text>
        <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: `${accent}15`, alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={accent} strokeWidth={2} />
        </View>
      </View>
      <Text style={{ fontSize: 30, fontFamily: "Inter_800ExtraBold", color: Colors.text.DEFAULT, marginTop: 4, letterSpacing: -1 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 1 }}>
        {description}
      </Text>
    </View>
  );
}

/* ── Overdue Box ── */
function OverdueBox({ label, value, color, bg, border }: {
  label: string; value: number; color: string; bg: string; border: string;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 10, paddingTop: 14, paddingBottom: 14, alignItems: "center", borderWidth: 1, borderColor: border }}>
      <Text style={{ fontSize: 24, fontFamily: "Inter_800ExtraBold", color }}>{value}</Text>
      <Text style={{ fontSize: 10, fontFamily: "Inter_500Medium", color, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

/* ── Dashboard ── */
export default function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      const [demandasRes, municipeRes, statusRes] = await Promise.all([
        supabase.from("demandas").select("id, status, data_prazo", { count: "exact" }),
        supabase.from("municipes").select("id", { count: "exact" }),
        supabase.from("demanda_status").select("slug, nome, cor").eq("ativo", true).order("ordem"),
      ]);

      const demandas = demandasRes.data || [];
      const totalDemandas = demandasRes.count || 0;
      const totalMunicipes = municipeRes.count || 0;

      const slugsConcluidas = ["concluida", "resolvida", "atendida", "finalizada"];
      const demConcluidas = demandas.filter((d) => slugsConcluidas.includes(d.status || "")).length;
      const taxaConclusao = totalDemandas > 0 ? Math.round((demConcluidas / totalDemandas) * 100) : 0;

      const hoje = new Date().toISOString().split("T")[0];
      const slugsAbertos = ["solicitada", "em_andamento", "em_analise", "encaminhada", "em_producao", "visitado"];
      const emAtraso = demandas.filter((d) => d.data_prazo && d.data_prazo < hoje && slugsAbertos.includes(d.status || ""));
      const abertas = demandas.filter((d) => slugsAbertos.includes(d.status || "")).length;

      const statusCount: Record<string, number> = {};
      demandas.forEach((d) => { statusCount[d.status || "desconhecido"] = (statusCount[d.status || "desconhecido"] || 0) + 1; });

      const statusDistribuicao = (statusRes.data || [])
        .map((s) => ({ slug: s.slug, nome: s.nome, cor: s.cor, count: statusCount[s.slug] || 0 }))
        .filter((s) => s.count > 0);

      const diasAtraso = (prazo: string) => Math.floor((new Date().getTime() - new Date(prazo).getTime()) / 86400000);
      const atraso30 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 30).length;
      const atraso60 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 60).length;
      const atraso90 = emAtraso.filter((d) => diasAtraso(d.data_prazo!) >= 90).length;

      return { totalDemandas, totalMunicipes, abertas, taxaConclusao, emAtraso: emAtraso.length, atraso30, atraso60, atraso90, statusDistribuicao };
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    setRefreshing(false);
  };

  if (isLoading) return <Loading message="Carregando dashboard..." />;

  const donutSegments = kpis?.statusDistribuicao?.map((s) => ({ value: s.count, color: s.cor, label: s.nome })) || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader
        title="Visão Geral"
        subtitle="Métricas e demandas em tempo real"
        right={
          <Pressable onPress={() => {}} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.muted, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border.DEFAULT }}>
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
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16 }}
        >
          <KPICard label="Total" value={kpis?.totalDemandas ?? 0} icon={FileText} accent={Colors.primary.DEFAULT} description="demandas" />
          <View style={{ width: 10 }} />
          <KPICard label="Abertas" value={kpis?.abertas ?? 0} icon={Clock} accent={Colors.warning.DEFAULT} description="aguardando" />
          <View style={{ width: 10 }} />
          <KPICard label="Em atraso" value={kpis?.emAtraso ?? 0} icon={AlertTriangle} accent={Colors.destructive.DEFAULT} description="passaram prazo" />
          <View style={{ width: 10 }} />
          <KPICard label="Conclusão" value={`${kpis?.taxaConclusao ?? 0}%`} icon={TrendingUp} accent={Colors.success.DEFAULT} description="taxa atendimento" />
          <View style={{ width: 10 }} />
          <KPICard label="Munícipes" value={kpis?.totalMunicipes ?? 0} icon={Users} accent="#8B5CF6" description="cadastrados" />
        </ScrollView>

        {/* Donut Chart */}
        <View style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 14 }}>
          <Card>
            <CardContent>
              <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginBottom: 16 }}>
                Demandas por Status
              </Text>
              {donutSegments.length > 0 ? (
                <DonutChart
                  segments={donutSegments}
                  size={130}
                  strokeWidth={16}
                  centerValue={kpis?.totalDemandas ?? 0}
                  centerLabel="total"
                />
              ) : (
                <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.muted, textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
                  Nenhuma demanda registrada
                </Text>
              )}
            </CardContent>
          </Card>
        </View>

        {/* Em atraso */}
        <View style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 30 }}>
          <Card>
            <CardContent>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AlertTriangle size={16} color={Colors.destructive.DEFAULT} />
                  <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginLeft: 8 }}>
                    Em Atraso
                  </Text>
                </View>
                <Badge label={String(kpis?.emAtraso ?? 0)} color="#FFFFFF" bg={Colors.destructive.DEFAULT} />
              </View>
              <View style={{ flexDirection: "row" }}>
                <OverdueBox label="30+ dias" value={kpis?.atraso30 ?? 0} color="#D97706" bg="#FEF3C7" border="#FDE68A" />
                <View style={{ width: 10 }} />
                <OverdueBox label="60+ dias" value={kpis?.atraso60 ?? 0} color="#EA580C" bg="#FFF7ED" border="#FED7AA" />
                <View style={{ width: 10 }} />
                <OverdueBox label="90+ dias" value={kpis?.atraso90 ?? 0} color="#DC2626" bg="#FEF2F2" border="#FECACA" />
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
