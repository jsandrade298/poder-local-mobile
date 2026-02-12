import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, ChevronRight } from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { PageHeader, SearchBar, FAB } from "@/components/layout";
import { Colors } from "@/constants/theme";
import { formatPhone } from "@/lib/utils";
import { makePhoneCall } from "@/lib/linking";

export default function MunicipesListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: municipes = [], isLoading } = useQuery({
    queryKey: ["municipes-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipes")
        .select(`
          id, nome, telefone, email, bairro,
          categoria_id, municipe_categorias(nome, cor, icone),
          demandas(id)
        `)
        .order("nome")
        .limit(500);

      if (error) throw error;
      return data || [];
    },
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return municipes;
    const term = searchTerm.toLowerCase();
    return municipes.filter(
      (m) =>
        m.nome?.toLowerCase().includes(term) ||
        m.telefone?.includes(term) ||
        m.bairro?.toLowerCase().includes(term)
    );
  }, [municipes, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["municipes-list"] });
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const categoria = item.municipe_categorias as any;
      const demandasCount = Array.isArray(item.demandas) ? item.demandas.length : 0;
      const catColor = categoria?.cor || Colors.primary.DEFAULT;

      return (
        <Pressable
          onPress={() => router.push(`/(tabs)/municipes/${item.id}`)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            paddingVertical: 14,
            paddingHorizontal: 20,
            backgroundColor: pressed ? Colors.muted : "transparent",
            borderBottomWidth: 1,
            borderBottomColor: Colors.border.light,
          })}
        >
          <Avatar name={item.nome} size={46} color={catColor} />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: Colors.text.DEFAULT,
              }}
              numberOfLines={1}
            >
              {item.nome}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: Colors.text.muted,
                marginTop: 1,
              }}
            >
              {formatPhone(item.telefone)}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end", gap: 4 }}>
            {categoria?.nome && (
              <Badge label={categoria.nome} color={catColor} bg={`${catColor}15`} />
            )}
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                color: Colors.text.muted,
              }}
            >
              {demandasCount} demanda{demandasCount !== 1 ? "s" : ""}
            </Text>
          </View>
        </Pressable>
      );
    },
    [router]
  );

  if (isLoading) return <Loading message="Carregando munícipes..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <PageHeader title="Munícipes" subtitle={`${municipes.length} cadastrados`} />
      <SearchBar
        placeholder="Buscar por nome, telefone..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onFilterPress={() => {}}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="Nenhum munícipe encontrado"
            subtitle={searchTerm ? "Tente outro termo de busca" : "Cadastre o primeiro munícipe"}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB onPress={() => {/* TODO: criar munícipe */}} />
    </SafeAreaView>
  );
}
