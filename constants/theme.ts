/**
 * Design tokens alinhados com o tema web do Poder Local Gestor
 * Baseado em: src/index.css (--primary: 213 94% 45%, --secondary: 158 64% 45%)
 */

export const Colors = {
  primary: {
    DEFAULT: "#0966C2",
    light: "#3B8AD9",
    dark: "#074D8F",
    bg: "#EBF4FF",
    bgSoft: "#F0F7FF",
  },
  secondary: {
    DEFAULT: "#29A575",
    light: "#3DBF8E",
    dark: "#1E7D59",
    bg: "#ECFDF5",
  },
  background: "#FFFFFF",
  page: "#F8FAFC",
  muted: "#F1F5F9",
  card: "#FFFFFF",
  border: {
    DEFAULT: "#E2E8F0",
    light: "#F1F5F9",
  },
  text: {
    DEFAULT: "#0F172A",
    secondary: "#475569",
    muted: "#94A3B8",
  },
  destructive: {
    DEFAULT: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
  warning: {
    DEFAULT: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  success: {
    DEFAULT: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  info: {
    DEFAULT: "#8B5CF6",
    bg: "#F3F0FF",
  },
} as const;

/** Cores de status de demanda */
export const StatusColors: Record<string, { color: string; bg: string; label: string }> = {
  solicitada: { color: Colors.warning.DEFAULT, bg: Colors.warning.bg, label: "Solicitada" },
  em_andamento: { color: Colors.primary.DEFAULT, bg: Colors.primary.bg, label: "Em andamento" },
  concluida: { color: Colors.success.DEFAULT, bg: Colors.success.bg, label: "Concluída" },
  cancelada: { color: Colors.destructive.DEFAULT, bg: Colors.destructive.bg, label: "Cancelada" },
  pendente: { color: Colors.warning.DEFAULT, bg: Colors.warning.bg, label: "Pendente" },
};

/** Cores de prioridade */
export const PrioridadeColors: Record<string, { color: string; bg: string; label: string }> = {
  alta: { color: "#DC2626", bg: "#FEE2E2", label: "Alta" },
  media: { color: "#D97706", bg: "#FEF3C7", label: "Média" },
  baixa: { color: "#059669", bg: "#D1FAE5", label: "Baixa" },
};

/** Cores de status de rota */
export const RotaStatusColors: Record<string, { color: string; bg: string; label: string }> = {
  pendente: { color: Colors.warning.DEFAULT, bg: Colors.warning.bg, label: "Pendente" },
  em_andamento: { color: Colors.primary.DEFAULT, bg: Colors.primary.bg, label: "Em andamento" },
  concluida: { color: Colors.success.DEFAULT, bg: Colors.success.bg, label: "Concluída" },
  cancelada: { color: Colors.destructive.DEFAULT, bg: Colors.destructive.bg, label: "Cancelada" },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
