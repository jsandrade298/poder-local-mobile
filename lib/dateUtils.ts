import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata data completa: "12/02/2026 14:30"
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return "—";
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch {
    return "—";
  }
}

/**
 * Formata apenas a data: "12/02/2026"
 */
export function formatDateOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return "—";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "—";
  }
}

/**
 * Tempo relativo: "há 3 dias", "há 2 horas"
 */
export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return "";
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Formata para dia da semana curto: "Seg, 12 Fev"
 */
export function formatShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return "—";
    return format(date, "EEE, dd MMM", { locale: ptBR });
  } catch {
    return "—";
  }
}
