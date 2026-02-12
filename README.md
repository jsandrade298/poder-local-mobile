# Poder Local Gestor — App Mobile (Android)

App Android do sistema de gestão de gabinete, construído com **Expo + React Native + TypeScript**.

## Pré-requisitos

- Conta no [Expo (EAS)](https://expo.dev/signup)
- Node.js 18+ (para desenvolvimento local, mas é possível fazer tudo pelo browser)
- Projeto Supabase já configurado (mesmo do web app)

## Setup Rápido

### 1. Clonar e configurar

```bash
# Clonar o repo
git clone https://github.com/SEU_USUARIO/poder-local-mobile.git
cd poder-local-mobile

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as credenciais do Supabase
```

### 2. Configurar EAS (uma vez)

```bash
# Instalar CLI do EAS
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure
```

### 3. Rodar em desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npx expo start

# Escanear QR code com o app Expo Go no celular
```

### 4. Gerar APK de teste

```bash
# Build de desenvolvimento (APK para testes)
eas build --profile preview --platform android
```

### 5. Build de produção

```bash
# App Bundle para Play Store
eas build --profile production --platform android
```

## Workflow pelo Navegador (sem instalar nada local)

1. **Editar código** → Use github.dev (pressione `.` no repo) ou GitHub Codespaces
2. **Build** → Rode `eas build` no terminal do Codespaces ou via GitHub Actions
3. **Testar** → Baixe o APK gerado pelo EAS Build e instale no celular
4. **Updates OTA** → `eas update` para enviar atualizações sem rebuild

## Estrutura do Projeto

```
app/                    # Telas (Expo Router - file-based)
├── auth/login.tsx      # Login
├── (tabs)/             # Tab navigation
│   ├── index.tsx       # Dashboard
│   ├── demandas/       # Lista + detalhe
│   ├── municipes/      # Lista + detalhe
│   ├── rotas/          # Lista + detalhe + Google Maps
│   └── mais.tsx        # Menu secundário
├── kanban.tsx          # (futuro) Quadro kanban
├── assessor-ia.tsx     # (futuro) Chat IA
└── _layout.tsx         # Root: fonts, providers, auth guard

components/             # Componentes reutilizáveis
├── ui/                 # Button, Card, Badge, Input, Avatar
└── layout/             # PageHeader, SearchBar, FAB, StatusBadge

contexts/               # AuthContext (Supabase Auth)
hooks/                  # React Query hooks (reutilizados do web)
lib/                    # Supabase client, utils, date, linking
constants/              # Design tokens (cores, tipografia)
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (anon key) do Supabase |

Para builds na nuvem (EAS), configure essas variáveis em `eas.json` ou via `eas secret:create`.

## Stack

- **Expo SDK 52** + Expo Router v4
- **React Native 0.76**
- **NativeWind** (Tailwind CSS para RN)
- **Supabase** (Auth + Database + Edge Functions)
- **TanStack React Query** (cache e data fetching)
- **Lucide React Native** (ícones)
