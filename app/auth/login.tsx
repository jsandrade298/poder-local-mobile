import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart3, LogIn, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors, Shadow, Radius } from "@/constants/theme";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Preencha todos os campos",
        text2: "Email e senha são obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Toast.show({
          type: "error",
          text1: "Erro no login",
          text2: error.message || "Verifique suas credenciais.",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Login realizado!",
          text2: "Redirecionando...",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro inesperado",
        text2: "Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: Colors.page }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo + título */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 16,
              ...Shadow.md,
            }}
          >
            <LinearGradient
              colors={[Colors.primary.DEFAULT, Colors.secondary.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={30} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_700Bold",
              color: Colors.text.DEFAULT,
              letterSpacing: -0.5,
            }}
          >
            Poder Local Gestor
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: Colors.text.muted,
              marginTop: 4,
            }}
          >
            Sistema de Gestão do Gabinete
          </Text>
        </View>

        {/* Card do formulário */}
        <View
          style={{
            backgroundColor: Colors.card,
            borderRadius: Radius.lg,
            padding: 24,
            borderWidth: 1,
            borderColor: Colors.border.DEFAULT,
            ...Shadow.md,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: Colors.text.DEFAULT,
              marginBottom: 4,
            }}
          >
            Entrar
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Inter_400Regular",
              color: Colors.text.muted,
              marginBottom: 24,
            }}
          >
            Acesse sua conta do gabinete
          </Text>

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            containerStyle={{ marginBottom: 16 }}
          />

          <View style={{ marginBottom: 24 }}>
            <Input
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 14,
                bottom: 12,
                padding: 4,
              }}
            >
              {showPassword ? (
                <EyeOff size={18} color={Colors.text.muted} />
              ) : (
                <Eye size={18} color={Colors.text.muted} />
              )}
            </Pressable>
          </View>

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
            icon={<LogIn size={18} color="#FFFFFF" />}
            style={{ marginBottom: 8 }}
          />
        </View>

        {/* Footer */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: Colors.text.muted,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Poder Local Gestor v1.0
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
