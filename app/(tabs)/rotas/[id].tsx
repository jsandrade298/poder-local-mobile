import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Check,
  Circle,
  Navigation,
  CheckCircle2,
  FileText,
  User,
} from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/layout";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { formatDateOnly } from "@/lib/dateUtils";
import { openRouteInGoogleMaps } from "@/lib/linking";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

export default function RotaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: rota, isLoading } = useQuery({
    queryKey: ["rota-detalhe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rotas")
        .select("*, rota_pontos(id, nome, endereco, tipo, referencia_id, latitude, longitude, visitado, observacao_visita, ordem, horario_agendado, duracao_estimada)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Mutation para marcar ponto como visitado
  const toggleVisitado = useMutation({
    mutationFn: async ({ pontoId, visitado }: { pontoId: string; visitado: boolean }) => {
      const { error } = await supabase
        .from("rota_pontos")
        .update({ visitado })
        .eq("id", pontoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rota-detalhe", id] });
      queryClient.invalidateQueries({ queryKey: ["rotas-list"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Erro ao atualizar ponto" });
    },
  });

  // Mutation para concluir rota
  const concluirRota = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("rotas")
        .update({ status: "concluida", concluida_em: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rota-detalhe", id] });
      queryClient.invalidateQueries({ queryKey: ["rotas-list"] });
      Toast.show({ type: "success", text1: "Rota concluída!", text2: "Bom trabalho! 🎉" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  // Mutation para iniciar rota
  const iniciarRota = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("rotas")
        .update({ status: "em_andamento" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rota-detalhe", id] });
      queryClient.invalidateQueries({ queryKey: ["rotas-list"] });
    },
  });

  if (isLoading) return <Loading message="Carregando rota..." />;
  if (!rota) return <Loading message="Rota não encontrada" />;

  const pontos = (rota.rota_pontos || []).sort((a: any, b: any) => a.ordem - b.ordem);
  const visitados = pontos.filter((p: any) => p.visitado).length;
  const total = pontos.length;
  const pct = total > 0 ? Math.round((visitados / total) * 100) : 0;

  const handleAbrirGoogleMaps = () => {
    const pontosValidos = pontos.filter((p: any) => p.latitude && p.longitude);
    if (pontosValidos.length < 2) {
      Alert.alert("Aviso", "A rota precisa de pelo menos 2 pontos com coordenadas.");
      return;
    }
    if (rota.status === "pendente") {
      iniciarRota.mutate();
    }
    openRouteInGoogleMaps(pontosValidos);
  };

  const handleConcluir = () => {
    Alert.alert(
      "Concluir Rota",
      "Deseja marcar esta rota como concluída?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Concluir", onPress: () => concluirRota.mutate() },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.background, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border.DEFAULT }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={22} color={Colors.text.DEFAULT} />
          </Pressable>
          <Text style={{ fontSize: 17, fontFamily: "Inter_700Bold", color: Colors.text.DEFAULT, flex: 1 }} numberOfLines={1}>
            {rota.titulo}
          </Text>
          <StatusBadge status={rota.status} type="rota" />
        </View>

        <View style={{ flexDirection: "row", gap: 12, paddingLeft: 34 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Calendar size={12} color={Colors.text.muted} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
              {formatDateOnly(rota.data_programada)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color={Colors.text.muted} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
              {visitados}/{total} visitados
            </Text>
          </View>
        </View>

        {/* Botão Google Maps */}
        {rota.status !== "concluida" && (
          <Pressable
            onPress={handleAbrirGoogleMaps}
            style={({ pressed }) => ({
              marginTop: 14,
              marginLeft: 34,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              backgroundColor: pressed ? Colors.primary.dark : Colors.primary.DEFAULT,
              borderRadius: 10,
              paddingVertical: 13,
              ...Shadow.md,
              shadowColor: Colors.primary.DEFAULT,
            })}
          >
            <Navigation size={18} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>
              Abrir rota no Google Maps
            </Text>
            <ExternalLink size={14} color="#FFFFFF" style={{ opacity: 0.7 }} />
          </Pressable>
        )}
      </View>

      {/* Progress bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.background }}>
        <View style={{ height: 6, backgroundColor: Colors.muted, borderRadius: 3 }}>
          <View
            style={{
              height: 6,
              backgroundColor: pct === 100 ? Colors.success.DEFAULT : Colors.primary.DEFAULT,
              borderRadius: 3,
              width: `${pct}%`,
            }}
          />
        </View>
      </View>

      {/* Timeline dos pontos */}
      <ScrollView style={{ flex: 1, backgroundColor: Colors.page }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginBottom: 14 }}>
          Paradas ({total})
        </Text>

        {pontos.map((ponto: any, i: number) => (
          <View key={ponto.id} style={{ flexDirection: "row", gap: 14, marginBottom: 0 }}>
            {/* Timeline connector */}
            <View style={{ alignItems: "center", width: 32 }}>
              <Pressable
                onPress={() => {
                  if (rota.status === "concluida") return;
                  toggleVisitado.mutate({ pontoId: ponto.id, visitado: !ponto.visitado });
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: ponto.visitado ? Colors.success.bg : Colors.muted,
                  borderWidth: 2,
                  borderColor: ponto.visitado ? Colors.success.DEFAULT : Colors.border.DEFAULT,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                {ponto.visitado ? (
                  <Check size={14} color={Colors.success.DEFAULT} strokeWidth={3} />
                ) : (
                  <Text style={{ fontSize: 12, fontFamily: "Inter_700Bold", color: Colors.text.muted }}>
                    {i + 1}
                  </Text>
                )}
              </Pressable>
              {i < pontos.length - 1 && (
                <View style={{ width: 2, flex: 1, backgroundColor: Colors.border.DEFAULT, marginVertical: -2 }} />
              )}
            </View>

            {/* Card */}
            <Card style={{ flex: 1, marginBottom: 10 }}>
              <CardContent style={{ padding: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Inter_600SemiBold",
                      color: ponto.visitado ? Colors.text.muted : Colors.text.DEFAULT,
                      textDecorationLine: ponto.visitado ? "line-through" : "none",
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {ponto.nome}
                  </Text>
                  <Badge
                    label={ponto.tipo === "demanda" ? "Demanda" : "Munícipe"}
                    color={ponto.tipo === "demanda" ? Colors.primary.DEFAULT : "#8B5CF6"}
                    bg={ponto.tipo === "demanda" ? Colors.primary.bg : "#F3F0FF"}
                  />
                </View>
                {ponto.endereco && (
                  <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 4 }}>
                    📍 {ponto.endereco}
                  </Text>
                )}
                {ponto.horario_agendado && (
                  <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted, marginTop: 2 }}>
                    🕐 {ponto.horario_agendado} ({ponto.duracao_estimada || 30}min)
                  </Text>
                )}
              </CardContent>
            </Card>
          </View>
        ))}

        {/* Botão concluir */}
        {rota.status !== "concluida" && rota.status !== "cancelada" && (
          <View style={{ marginTop: 10, marginBottom: 24 }}>
            <Button
              title="Concluir Rota"
              variant="secondary"
              size="lg"
              fullWidth
              icon={<CheckCircle2 size={18} color="#FFFFFF" />}
              onPress={handleConcluir}
              loading={concluirRota.isPending}
              style={{ borderRadius: 12 }}
            />
          </View>
        )}

        {/* Info de conclusão */}
        {rota.status === "concluida" && (
          <View style={{ backgroundColor: Colors.success.bg, borderRadius: Radius.md, padding: 16, marginTop: 10, marginBottom: 24, borderWidth: 1, borderColor: Colors.success.border }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.success.DEFAULT }}>
              ✅ Rota concluída
            </Text>
            {rota.concluida_em && (
              <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.success.DEFAULT, marginTop: 4 }}>
                em {formatDateOnly(rota.concluida_em)}
              </Text>
            )}
            {rota.observacoes_conclusao && (
              <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.secondary, marginTop: 8 }}>
                {rota.observacoes_conclusao}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
