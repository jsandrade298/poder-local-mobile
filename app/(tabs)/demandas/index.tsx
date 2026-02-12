import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { PageHeader, SearchBar, FAB, StatusBadge, PrioridadeBadge } from "@/components/layout";
import { Colors, StatusColors, PrioridadeColors } from "@/constants/theme";
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
        .select(`
          id, protocolo, titulo, status, prioridade,
          created_at, data_prazo,
          municipes(nome),
          areas(nome)
        `)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      return data || [];
    },
  });

  // Filtrar por busca
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return demandas;
    const term = searchTerm.toLowerCase();
    return demandas.filter(
      (d) =>
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const statusConfig = StatusColors[item.status] || StatusColors.solicitada;

      return (
        <Card
          accentColor={statusConfig.color}
          onPress={() => router.push(`/(tabs)/demandas/${item.id}`)}
          style={{ marginHorizontal: 20, marginBottom: 10 }}
        >
          <CardContent>
            {/* Protocolo + ações */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Inter_500Medium",
                    color: Colors.text.muted,
                    letterSpacing: 0.3,
                  }}
                >
                  #{item.protocolo}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: Colors.text.DEFAULT,
                    marginTop: 3,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {item.titulo}
                </Text>
              </View>
              <MoreHorizontal size={16} color={Colors.text.muted} />
            </View>

            {/* Badges */}
            <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <StatusBadge status={item.status} />
              {item.prioridade && <PrioridadeBadge prioridade={item.prioridade} />}
              {(item.areas as any)?.nome && (
                <Badge
                  label={(item.areas as any).nome}
                  color={Colors.text.secondary}
                  bg={Colors.muted}
                />
              )}
            </View>

            {/* Munícipe + tempo */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                {(item.municipes as any)?.nome && (
                  <>
                    <Avatar name={(item.municipes as any).nome} size={22} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Inter_400Regular",
                        color: Colors.text.secondary,
                      }}
                    >
                      {(item.municipes as any).nome}
                    </Text>
                  </>
                )}
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter_400Regular",
                  color: Colors.text.muted,
                }}
              >
                {formatRelativeTime(item.created_at)}
              </Text>
            </View>
          </CardContent>
        </Card>
      );
    },
    [router]
  );

  if (isLoading) return <Loading message="Carregando demandas..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader
        title="Demandas"
        subtitle={`${demandas.length} registradas`}
      />
      <SearchBar
        placeholder="Buscar por título, protocolo..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onFilterPress={() => {/* TODO: bottom sheet de filtros */}}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="Nenhuma demanda encontrada"
            subtitle={searchTerm ? "Tente outro termo de busca" : "Crie a primeira demanda"}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB onPress={() => {/* TODO: criar demanda */}} />
    </SafeAreaView>
  );
}
