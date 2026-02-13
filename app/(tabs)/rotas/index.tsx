import { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, MapPin, Navigation } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { PageHeader, StatusBadge } from "@/components/layout";
import { Colors, RotaStatusColors } from "@/constants/theme";
import { formatDateOnly } from "@/lib/dateUtils";

export default function RotasListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const renderItem = useCallback(({ item }: { item: any }) => {
    const pontos = (item.rota_pontos || []).sort((a: any, b: any) => a.ordem - b.ordem);
    const visitados = pontos.filter((p: any) => p.visitado).length;
    const total = pontos.length;
    const pct = total > 0 ? Math.round((visitados / total) * 100) : 0;
    const isComplete = pct === 100;
    const barColor = isComplete ? Colors.success.DEFAULT : Colors.primary.DEFAULT;

    return (
      <Card
        onPress={() => router.push(`/(tabs)/rotas/${item.id}` as any)}
        style={{ marginLeft: 20, marginRight: 20, marginBottom: 12 }}
      >
        <CardContent>
          {/* Title + Status */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginRight: 10 }} numberOfLines={2}>
              {item.titulo}
            </Text>
            <StatusBadge status={item.status} type="rota" />
          </View>

          {/* Date + stops */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Calendar size={12} color={Colors.text.muted} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginLeft: 4 }}>
              {formatDateOnly(item.data_programada)}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.text.muted, marginLeft: 8, marginRight: 4 }}>·</Text>
            <MapPin size={12} color={Colors.text.muted} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginLeft: 4 }}>
              {total} parada{total !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <View style={{ flex: 1, height: 6, backgroundColor: Colors.border.light, borderRadius: 3 }}>
              <View style={{ height: 6, backgroundColor: barColor, borderRadius: 3, width: `${pct}%` }} />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: barColor, marginLeft: 12, minWidth: 32, textAlign: "right" }}>
              {pct}%
            </Text>
          </View>

          {/* Point tags */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
            {pontos.slice(0, 3).map((p: any, i: number) => (
              <View
                key={p.id}
                style={{
                  backgroundColor: p.visitado ? Colors.success.bg : Colors.muted,
                  borderRadius: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                  marginRight: 6,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Inter_500Medium",
                    color: p.visitado ? Colors.success.DEFAULT : Colors.text.muted,
                    textDecorationLine: p.visitado ? "line-through" : "none",
                  }}
                  numberOfLines={1}
                >
                  {p.nome}
                </Text>
              </View>
            ))}
            {pontos.length > 3 && (
              <View style={{ backgroundColor: Colors.muted, borderRadius: 6, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
                <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.text.muted }}>
                  +{pontos.length - 3}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    );
  }, [router]);

  if (isLoading) return <Loading message="Carregando rotas..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader title="Rotas Salvas" subtitle="Planejadas no gabinete" />
      <FlatList
        data={rotas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />}
        ListEmptyComponent={<EmptyState icon="🗺️" title="Nenhuma rota encontrada" subtitle="Crie rotas pelo computador e elas aparecerão aqui" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
