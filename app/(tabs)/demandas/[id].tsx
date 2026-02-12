import { useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Edit,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  User,
  Building2,
  Flag,
} from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Feedback";
import { StatusBadge, PrioridadeBadge } from "@/components/layout";
import { Colors, Radius, Shadow, Spacing } from "@/constants/theme";
import { formatDateOnly, formatRelativeTime } from "@/lib/dateUtils";
import { makePhoneCall, openWhatsApp } from "@/lib/linking";

export default function DemandaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dados" | "atividades" | "anexos">("dados");

  const { data: demanda, isLoading } = useQuery({
    queryKey: ["demanda-detalhe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demandas")
        .select(`
          *,
          municipes(id, nome, telefone, email, bairro),
          areas(nome)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Atividades
  const { data: atividades = [] } = useQuery({
    queryKey: ["demanda-atividades", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demanda_atividades")
        .select("*, profiles:created_by(nome)")
        .eq("demanda_id", id)
        .order("data_atividade", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id && activeTab === "atividades",
  });

  if (isLoading) return <Loading message="Carregando demanda..." />;
  if (!demanda) return <Loading message="Demanda não encontrada" />;

  const municipe = demanda.municipes as any;

  const infoRows = [
    { label: "Munícipe", value: municipe?.nome, icon: User },
    { label: "Área", value: (demanda.areas as any)?.nome, icon: Building2 },
    { label: "Prioridade", value: demanda.prioridade, icon: Flag, isBadge: true },
    { label: "Criada em", value: formatDateOnly(demanda.created_at), icon: Calendar },
    { label: "Prazo", value: formatDateOnly(demanda.data_prazo), icon: Calendar },
    { label: "Bairro", value: demanda.bairro, icon: MapPin },
    { label: "Logradouro", value: demanda.logradouro ? `${demanda.logradouro}${demanda.numero ? `, ${demanda.numero}` : ""}` : null, icon: MapPin },
  ].filter((r) => r.value);

  const tabs = ["dados", "atividades", "anexos"] as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          backgroundColor: Colors.background,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.DEFAULT,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={{ padding: 4 }}>
            <ChevronLeft size={22} color={Colors.text.DEFAULT} />
          </Pressable>
          <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.text.muted }}>
            #{demanda.protocolo}
          </Text>
          <View style={{ marginLeft: "auto" }}>
            <StatusBadge status={demanda.status || "solicitada"} />
          </View>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontFamily: "Inter_700Bold",
            color: Colors.text.DEFAULT,
            lineHeight: 24,
            paddingLeft: 38,
          }}
        >
          {demanda.titulo}
        </Text>

        {/* Ações rápidas */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 14, paddingLeft: 38 }}>
          <Pressable
            onPress={() => {/* TODO: editar */}}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: Colors.primary.bg,
              borderRadius: 8,
              paddingVertical: 10,
            }}
          >
            <Edit size={14} color={Colors.primary.DEFAULT} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.primary.DEFAULT }}>
              Editar
            </Text>
          </Pressable>

          {municipe?.telefone && (
            <Pressable
              onPress={() => makePhoneCall(municipe.telefone)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: Colors.success.bg,
                borderRadius: 8,
                paddingVertical: 10,
              }}
            >
              <Phone size={14} color={Colors.success.DEFAULT} />
              <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.success.DEFAULT }}>
                Ligar
              </Text>
            </Pressable>
          )}

          {municipe?.telefone && (
            <Pressable
              onPress={() => openWhatsApp(municipe.telefone)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: "#ECFDF5",
                borderRadius: 8,
                paddingVertical: 10,
              }}
            >
              <MessageCircle size={14} color="#25D366" />
              <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#25D366" }}>
                Zap
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.DEFAULT,
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab ? Colors.primary.DEFAULT : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                color: activeTab === tab ? Colors.primary.DEFAULT : Colors.text.muted,
                textTransform: "capitalize",
              }}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.page }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "dados" && (
          <>
            {/* Info rows */}
            {infoRows.map((row, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border.light,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <row.icon size={14} color={Colors.text.muted} />
                  <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                    {row.label}
                  </Text>
                </View>
                {row.isBadge ? (
                  <PrioridadeBadge prioridade={row.value} />
                ) : (
                  <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.DEFAULT }}>
                    {row.value}
                  </Text>
                )}
              </View>
            ))}

            {/* Descrição */}
            {demanda.descricao && (
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.muted, marginBottom: 8 }}>
                  Descrição
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.DEFAULT, lineHeight: 20 }}>
                  {demanda.descricao}
                </Text>
              </View>
            )}

            {/* Observações */}
            {demanda.observacoes && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.muted, marginBottom: 8 }}>
                  Observações
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.DEFAULT, lineHeight: 20 }}>
                  {demanda.observacoes}
                </Text>
              </View>
            )}
          </>
        )}

        {activeTab === "atividades" && (
          <View style={{ gap: 12 }}>
            {atividades.length === 0 ? (
              <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.muted, textAlign: "center", paddingVertical: 40 }}>
                Nenhuma atividade registrada
              </Text>
            ) : (
              atividades.map((a: any, i: number) => (
                <Card key={a.id}>
                  <CardContent style={{ padding: 14 }}>
                    <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT }}>
                      {a.titulo}
                    </Text>
                    {a.descricao && (
                      <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.text.secondary, marginTop: 4, lineHeight: 18 }}>
                        {a.descricao}
                      </Text>
                    )}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                        {(a.profiles as any)?.nome || "—"}
                      </Text>
                      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>
                        {formatRelativeTime(a.data_atividade)}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        )}

        {activeTab === "anexos" && (
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.muted, textAlign: "center", paddingVertical: 40 }}>
            Nenhum anexo encontrado
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
