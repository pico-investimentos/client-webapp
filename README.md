# Pico Investimentos — Client Webapp

Fundação da área do investidor da Pico Investimentos.

## Stack

- React 19 e TypeScript
- Vite
- Tailwind CSS v4
- HeroUI v3
- TanStack Router com rotas baseadas em arquivos
- TanStack Query
- Motion
- Vitest e ESLint

## Requisitos

- Node.js 20.19 ou superior
- npm 10 ou superior

## Primeiros passos

```bash
cp .env.example .env
npm install
npm run dev
```

## Comandos

```bash
npm run dev        # servidor local
npm run build      # typecheck e build de produção
npm run lint       # análise estática
npm run test       # testes automatizados
npm run preview    # prévia do build
```

## Estrutura

```text
src/
├── app/          # providers, router e configuração global
├── config/       # variáveis de ambiente validadas
├── features/     # módulos de negócio por funcionalidade
├── routes/       # rotas do TanStack Router
├── shared/       # componentes, utilitários e infraestrutura reutilizável
├── styles/       # tema e estilos globais
└── test/         # configuração de testes
```

Os valores exibidos na página inicial são demonstrativos. Nenhum dado financeiro
real ou mecanismo de autenticação foi conectado nesta etapa.

Consulte [`docs/architecture.md`](docs/architecture.md) para as decisões da
fundação e os limites de segurança.
