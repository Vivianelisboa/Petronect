# Njila — Plataforma de Reengajamento de Fornecedores

Sistema que monitora o comportamento dos fornecedores no Portal Petronect,
identifica o momento certo de reengajar cada um e dá à equipe Petronect as
ferramentas para agir: fila priorizada, ficha completa por fornecedor,
assistente virtual (Paola) e um Portal do fornecedor simulado.

O projeto tem **duas visões**:

| Visão | Rota | Público |
|---|---|---|
| Central de Operações | `/` | Equipe interna Petronect (Marketing/Atendimento) |
| Portal do fornecedor | `/portal` | Fornecedor (experiência do usuário final) |

## Como rodar (passo a passo)

**Pré-requisitos:** Node.js 20+ e Python 3 (apenas para gerar o banco de demonstração).

### 1. Backend

```bash
cd njila-project/backend
npm run seed     # cria o banco SQLite com 60 empresas fictícias (usa Python)
npm start        # sobe a API em http://localhost:3000
```

### 2. Frontend

Em **outro terminal**:

```bash
cd njila-project/frontend
npm install
npm run dev      # sobe em http://localhost:5173
```

Abra `http://localhost:5173` no navegador.

## O que ver em cada tela

- **Central de Operações** (`/`) — fila do dia com empresas priorizadas por
  score, filtros por momento/situação e ações rápidas
- **Ficha da empresa** (`/empresa/:id`) — jornada completa do fornecedor,
  timeline, histórico de ações e **engajamento** (perfil Ativo/Novo/Em
  Risco/Inativo com mensagem de reengajamento pronta para enviar)
- **Assistente** (`/assistente`) — simulação da Paola na visão do fornecedor
- **Analítico** (`/analitico`) — visão analítica com gráficos e atividade
- **Portal do fornecedor** (`/portal`) — experiência do usuário final, com
  onboarding de perfil, jornada personalizada e chat flutuante da Paola

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/fila-hoje` | Fila do dia (filtros: `momento`, `limit`, `data`) |
| GET | `/empresa/:id` | Ficha do fornecedor (inclui `engajamento`) |
| GET | `/empresa/:id/assistente` | Contexto proativo da Paola |
| POST | `/empresa/:id/acao` | Registra ação da equipe |
| POST | `/chat` | Chat livre da Paola |
| GET | `/resumo` | Resumo geral |
| GET | `/indicadores?periodo=7|30|90` | Visão analítica |
| POST | `/eventos` | Ingestão de eventos de acesso consentidos |
| GET | `/relatorio-reengajamento` | Relatório priorizado (JSON ou `?formato=csv`) |

## Testes

```bash
cd njila-project/backend && npm test    # classificador de engajamento
cd njila-project/frontend && npm test   # helpers da Paola
```

## Stack

React 18 + Vite + Tailwind · Node.js (serverless) + SQLite · i18next ·
Zod · recharts · lucide-react. Deploy: `serverless.yml` (AWS) e exemplos em
`functions/aws` e `functions/azure`.
