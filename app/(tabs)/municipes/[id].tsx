import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Phone, MessageCircle, Mail, MapPin, Calendar, Briefcase } from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Feedback";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { formatDateOnly } from "@/lib/dateUtils";
import { formatPhone } from "@/lib/utils";
import { makePhoneCall, openWhatsApp } from "@/lib/linking";

export default function MunicipeDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: municipe, isLoading } = useQuery({
    queryKey: ["municipe-detalhe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipes")
        .select("*, municipe_categorias(nome, cor)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (!municipe) return <Loading message="Munícipe não encontrado" />;

  const cat = municipe.municipe_categorias as any;
  const catColor = cat?.cor || Colors.primary.DEFAULT;

  const infoRows = [
    { label: "Telefone", value: formatPhone(municipe.telefone), icon: Phone },
    { label: "Email", value: municipe.email, icon: Mail },
    { label: "Bairro", value: municipe.bairro, icon: MapPin },
    { label: "Endereço", value: municipe.endereco, icon: MapPin },
    { label: "Cidade", value: municipe.cidade, icon: MapPin },
    { label: "CEP", value: municipe.cep, icon: MapPin },
    { label: "Profissão", value: municipe.profissao, icon: Briefcase },
    { label: "Nascimento", value: formatDateOnly(municipe.data_nascimento), icon: Calendar },
  ].filter(r => r.value && r.value !== "—");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.background, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border.DEFAULT }}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <ChevronLeft size={22} color={Colors.text.DEFAULT} />
          <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text.secondary }}>Voltar</Text>
        </Pressable>

        <View style={{ alignItems: "center", gap: 10 }}>
          <Avatar name={municipe.nome} size={72} color={catColor} />
          <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.text.DEFAULT }}>{municipe.nome}</Text>
          {cat?.nome && <Badge label={cat.nome} color={catColor} bg={`${catColor}15`} size="md" />}
        </View>

        {/* Ações rápidas */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          {municipe.telefone && (
            <Pressable onPress={() => makePhoneCall(municipe.telefone)} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: Colors.primary.bg, borderRadius: 10, paddingVertical: 12 }}>
              <Phone size={16} color={Colors.primary.DEFAULT} />
              <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.primary.DEFAULT }}>Ligar</Text>
            </Pressable>
          )}
          {municipe.telefone && (
            <Pressable onPress={() => openWhatsApp(municipe.telefone)} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#ECFDF5", borderRadius: 10, paddingVertical: 12 }}>
              <MessageCircle size={16} color="#25D366" />
              <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#25D366" }}>WhatsApp</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: Colors.page }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {infoRows.map((row, i) => (
          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <row.icon size={14} color={Colors.text.muted} />
              <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.muted }}>{row.label}</Text>
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.DEFAULT, maxWidth: "55%", textAlign: "right" }} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}

        {municipe.observacoes && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.muted, marginBottom: 8 }}>Observações</Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.text.DEFAULT, lineHeight: 20 }}>{municipe.observacoes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
