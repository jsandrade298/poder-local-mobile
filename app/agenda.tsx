import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { EmptyState } from "@/components/ui/Feedback";

export default function AgendaScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.page }} edges={["bottom"]}>
      <EmptyState icon="📅" title="Solicitar Agenda" subtitle="Agendamento de compromissos — será implementado na Fase 3" />
    </SafeAreaView>
  );
}
