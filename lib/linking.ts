import { Linking, Alert } from "react-native";

interface RotaPonto {
  latitude: number;
  longitude: number;
  nome?: string;
}

/**
 * Abre uma rota no Google Maps com waypoints
 * Gera deep link: google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=...
 */
export async function openRouteInGoogleMaps(pontos: RotaPonto[]) {
  if (!pontos || pontos.length < 2) {
    Alert.alert("Erro", "A rota precisa ter pelo menos 2 pontos.");
    return;
  }

  const origin = `${pontos[0].latitude},${pontos[0].longitude}`;
  const destination = `${pontos[pontos.length - 1].latitude},${pontos[pontos.length - 1].longitude}`;
  const waypoints = pontos
    .slice(1, -1)
    .map((p) => `${p.latitude},${p.longitude}`)
    .join("|");

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback: abrir no navegador
      await Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert("Erro", "Não foi possível abrir o Google Maps.");
  }
}

/**
 * Abre o app de telefone com o número
 */
export async function makePhoneCall(phone: string) {
  const clean = phone.replace(/\D/g, "");
  const url = `tel:+55${clean}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Erro", "Não foi possível fazer a ligação.");
  }
}

/**
 * Abre conversa no WhatsApp
 */
export async function openWhatsApp(phone: string, message?: string) {
  const clean = phone.replace(/\D/g, "");
  let url = `https://wa.me/55${clean}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
  }
}

/**
 * Abre um endereço no Google Maps (busca)
 */
export async function openAddressInMaps(address: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Erro", "Não foi possível abrir o Maps.");
  }
}
