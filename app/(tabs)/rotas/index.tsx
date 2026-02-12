import { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, MapPin, Navigation } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { PageHeader, StatusBadge } from "@/components/layout";
import { Colors, RotaStatusColors, Radius } from "@/constants/theme";
import { formatDateOnly } from "@/lib/dateUtils";
import { useAuth } from "@/contexts/AuthContext";

export default function RotasListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: rotas = [], isLoading } = useQuery({
    queryKey: ["rotas-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rotas")
        .select("*, rota_pontos(id, nome, visitado, tipo, endereco, latitude, longitude, ordem)")
        .order("data_programada", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["rotas-list"] });
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const pontos = item.rota_pontos || [];
      const visitados = pontos.filter((p: any) => p.visitado).length;
      const total = pontos.length;
      const pct = total > 0 ? Math.round((visitados / total) * 100) : 0;
      const stConfig = RotaStatusColors[item.status] || RotaStatusColors.pendente;

      return (
        <Card
          onPress={() => router.push(`/(tabs)/rotas/${item.id}`)}
          style={{ marginHorizontal: 20, marginBottom: 10 }}
        >
          <CardContent>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT }}>
                  {item.titulo}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <Calendar size={12} color={Colors.text.muted} />
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                    {formatDateOnly(item.data_programada)}
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.text.muted }}>·</Text>
                  <MapPin size={12} color={Colors.text.muted} />
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                    {total} parada{total !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
              <StatusBadge status={item.status} type="rota" />
            </View>

            {/* Progress bar */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1, height: 6, backgroundColor: Colors.muted, borderRadius: 3 }}>
                <View
                  style={{
                    height: 6,
                    backgroundColor: pct === 100 ? Colors.success.DEFAULT : Colors.primary.DEFAULT,
                    borderRadius: 3,
                    width: `${pct}%`,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter_600SemiBold",
                  color: pct === 100 ? Colors.success.DEFAULT : Colors.primary.DEFAULT,
                  minWidth: 36,
                  textAlign: "right",
                }}
              >
                {visitados}/{total}
              </Text>
            </View>

            {/* Pontos preview */}
            <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {pontos
                .sort((a: any, b: any) => a.ordem - b.ordem)
                .slice(0, 3)
                .map((p: any) => (
                  <Text
                    key={p.id}
                    style={{
                      fontSize: 10,
                      fontFamily: "Inter_500Medium",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                      backgroundColor: p.visitado ? Colors.success.bg : Colors.muted,
                      color: p.visitado ? Colors.success.DEFAULT : Colors.text.muted,
                      textDecorationLine: p.visitado ? "line-through" : "none",
                      overflow: "hidden",
                    }}
                    numberOfLines={1}
                  >
                    {p.nome}
                  </Text>
                ))}
              {pontos.length > 3 && (
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Inter_500Medium",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: Colors.muted,
                    color: Colors.text.muted,
                  }}
                >
                  +{pontos.length - 3}
                </Text>
              )}
            </View>
          </CardContent>
        </Card>
      );
    },
    [router]
  );

  if (isLoading) return <Loading message="Carregando rotas..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader
        title="Rotas Salvas"
        subtitle="Planejadas no gabinete"
        right={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Navigation size={14} color={Colors.primary.DEFAULT} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.primary.DEFAULT }}>
              {rotas.length}
            </Text>
          </View>
        }
      />
      <FlatList
        data={rotas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🗺️"
            title="Nenhuma rota encontrada"
            subtitle="Crie rotas pelo computador e elas aparecerão aqui para uso em campo"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
