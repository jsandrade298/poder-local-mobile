import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { EmptyState } from "@/components/ui/Feedback";

export default function KanbanScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.page }} edges={["bottom"]}>
      <EmptyState icon="📋" title="Kanban" subtitle="Quadro de acompanhamento — será implementado na Fase 2" />
    </SafeAreaView>
  );
}
