import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoreHorizontal, User as UserIcon } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { PageHeader, SearchBar, FAB, StatusBadge, PrioridadeBadge } from "@/components/layout";
import { Colors, StatusColors } from "@/constants/theme";
import { formatRelativeTime } from "@/lib/dateUtils";

export default function DemandasListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: demandas = [], isLoading } = useQuery({
    queryKey: ["demandas-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demandas")
        .select("id, protocolo, titulo, status, prioridade, created_at, data_prazo, municipes(nome), areas(nome)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return demandas;
    const term = searchTerm.toLowerCase();
    return demandas.filter((d) =>
      d.titulo?.toLowerCase().includes(term) ||
      d.protocolo?.toLowerCase().includes(term) ||
      (d.municipes as any)?.nome?.toLowerCase().includes(term)
    );
  }, [demandas, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["demandas-list"] });
    setRefreshing(false);
  };

  const renderItem = useCallback(({ item }: { item: any }) => {
    const statusConfig = StatusColors[item.status] || StatusColors.solicitada;
    const municipeNome = (item.municipes as any)?.nome;
    const areaNome = (item.areas as any)?.nome;

    return (
      <Card
        accentColor={statusConfig.color}
        onPress={() => router.push(`/(tabs)/demandas/${item.id}` as any)}
        style={{ marginHorizontal: 20, marginBottom: 10 }}
      >
        <CardContent style={{ paddingVertical: 14 }}>
          {/* Protocol + more - uses View for row */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.text.muted, letterSpacing: 0.3 }}>
              #{item.protocolo}
            </Text>
            <MoreHorizontal size={16} color={Colors.text.muted} />
          </View>

          {/* Title */}
          <Text
            style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginTop: 4, lineHeight: 21 }}
            numberOfLines={2}
          >
            {item.titulo}
          </Text>

          {/* Badges row */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
            <StatusBadge status={item.status} />
            {item.prioridade && (
              <View style={{ marginLeft: 6 }}>
                <PrioridadeBadge prioridade={item.prioridade} />
              </View>
            )}
            {areaNome && (
              <View style={{ marginLeft: 6 }}>
                <Badge label={areaNome} color={Colors.text.secondary} bg={Colors.muted} />
              </View>
            )}
          </View>

          {/* Footer: municipe + time */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            {municipeNome ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <UserIcon size={13} color={Colors.text.muted} />
                <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.secondary, marginLeft: 5 }}>
                  {municipeNome}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
              {formatRelativeTime(item.created_at)}
            </Text>
          </View>
        </CardContent>
      </Card>
    );
  }, [router]);

  if (isLoading) return <Loading message="Carregando demandas..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader title="Demandas" subtitle={`${demandas.length} registradas`} />
      <SearchBar placeholder="Buscar por título, protocolo..." value={searchTerm} onChangeText={setSearchTerm} onFilterPress={() => {}} />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />}
        ListEmptyComponent={<EmptyState icon="📋" title="Nenhuma demanda encontrada" subtitle={searchTerm ? "Tente outro termo de busca" : "Crie a primeira demanda"} />}
        showsVerticalScrollIndicator={false}
      />
      <FAB onPress={() => {}} />
    </SafeAreaView>
  );
}
