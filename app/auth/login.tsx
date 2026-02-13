import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert("Erro no login", error.message || "Verifique suas credenciais.");
      }
    } catch (err) {
      Alert.alert("Erro", "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 60,
          paddingBottom: 60,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primary.DEFAULT, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFF" }}>PL</Text>
          </View>
          <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: Colors.text.DEFAULT }}>
            Poder Local Gestor
          </Text>
          <Text style={{ fontSize: 13, color: Colors.text.muted, marginTop: 4 }}>
            Sistema de Gestão do Gabinete
          </Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: "#FFF", borderRadius: 16, padding: 24, borderWidth: 1, borderColor: "#E2E8F0", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: Colors.text.DEFAULT, marginBottom: 4 }}>
            Entrar
          </Text>
          <Text style={{ fontSize: 13, color: Colors.text.muted, marginBottom: 24 }}>
            Acesse sua conta do gabinete
          </Text>

          {/* Email */}
          <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.secondary, marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: "#0F172A", marginBottom: 16, backgroundColor: "#FFF" }}
          />

          {/* Senha */}
          <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text.secondary, marginBottom: 6 }}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            style={{ borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: "#0F172A", marginBottom: 24, backgroundColor: "#FFF" }}
          />

          {/* Botão Entrar */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#074D8F" : "#0966C2",
              borderRadius: 12,
              paddingTop: 14,
              paddingBottom: 14,
              alignItems: "center" as const,
              justifyContent: "center" as const,
              opacity: loading ? 0.7 : 1,
              elevation: 2,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>
                Entrar
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
