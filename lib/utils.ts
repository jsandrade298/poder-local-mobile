/**
 * Retorna as iniciais de um nome (até 2 letras)
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formata número de telefone para exibição: (11) 99999-1234
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

/**
 * Formata telefone para link tel: (apenas números com +55)
 */
export function phoneToLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, "");
  if (clean.length >= 10) {
    return `tel:+55${clean}`;
  }
  return null;
}

/**
 * Formata telefone para link do WhatsApp
 */
export function phoneToWhatsApp(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, "");
  if (clean.length >= 10) {
    return `https://wa.me/55${clean}`;
  }
  return null;
}

/**
 * Trunca texto com elipses
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Gera cor a partir de uma string (para avatares consistentes)
 */
export function stringToColor(str: string): string {
  const colors = [
    "#0966C2", "#29A575", "#8B5CF6", "#F59E0B",
    "#EF4444", "#EC4899", "#06B6D4", "#F97316",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
