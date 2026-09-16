# Plataforma Njila — Projeto Completo

Backend (Node.js serverless) + Frontend (React/Vite/Tailwind) + Chatbot
(Assistente Contextual), já integrados, alinhados ao MVP oficial (6
estados da jornada + Score explicado + Assistente + Painel Operacional).

## Estrutura

```
njila-project/
├── backend/          # API + banco de dados + chatbot
│   ├── njila.db       # banco SQLite (já populado com 60 empresas simuladas)
│   ├── gerar_banco.py # script Python que gerou os dados (rodem de novo se quiserem mudar algo)
│   ├── src/
│   │   ├── db.js        # acesso ao banco
│   │   └── assistente.js # motor do chatbot (regras)
│   ├── handlers/        # 1 arquivo por rota (padrão AWS Lambda)
│   ├── server.js        # servidor local, zero instalação
│   └── serverless.yml   # deploy na AWS
├── frontend/          # painel visual (React + Vite + Tailwind)
│   └── src/
│       ├── App.jsx
│       ├── api.js         # chamadas à API, validadas com Zod
│       ├── i18n.js         # textos em pt-BR (i18next)
│       └── components/
│           ├── FilaHoje.jsx        # painel do Marketing/Atendimento
│           ├── FichaEmpresa.jsx    # histórico completo de 1 empresa
│           └── AssistenteWidget.jsx # chatbot, visão do fornecedor
└── AWS_DEPLOY.md      # como publicar tudo na AWS de verdade
```

## Como rodar tudo (passo a passo)

### 1. Backend
```bash
cd backend
npm run seed
node server.js
```
O comando `npm run seed` cria o banco SQLite mockado com empresas e eventos
de demonstração. Ele precisa de Python 3. Depois, o servidor sobe em
`http://localhost:3000` usando apenas o Node.js nativo (v20+).

### 2. Frontend
Em **outro terminal** (deixem o backend rodando no primeiro):
```bash
cd frontend
npm install
npm run dev
```
Sobe em `http://localhost:5173`. Esse sim precisa de `npm install`,
porque usa React, Tailwind, Zod e i18next de verdade.

Abram `http://localhost:5173` no navegador — o painel completo aparece,
já consumindo os dados do backend.

## O que cada aba do painel mostra

- **Central de Operações**: lista de empresas que precisam de atenção, ordenadas
  por Score de prioridade, com o motivo explicado
- **Ficha da Empresa**: clicando em "Ver ficha" numa empresa da fila,
  mostra a linha do tempo completa da jornada dela + histórico de ações
  já tomadas
- **Assistente (visão do fornecedor)**: simula o que a EMPRESA veria
  logada no Portal — o card proativo do chatbot aparecendo sozinho
  (ex: "você não terminou o pagamento da taxa"), mais um chat pra
  perguntas livres

## Sobre o chatbot

O Assistente tem 2 camadas:
1. **Mensagens proativas** (por regra, 100% previsível) — dispara sozinho
   baseado no momento da jornada da empresa, igual aos exemplos do
   documento do MVP ("taxa iniciada", "cadastro abandonado", etc.)
2. **Chat de conversa livre** — responde perguntas soltas tipo "como pago
   a taxa?" batendo palavras-chave numa base de conhecimento simples

Isso já é suficiente pra demo. Se quiserem um chatbot com IA generativa de
verdade depois, tem o caminho completo explicado em `AWS_DEPLOY.md`.

## Banco de dados

É um arquivo SQLite (`backend/njila.db`), já vem pronto com 60 empresas
fictícias e ~270 eventos simulados, distribuídos nos 6 estados oficiais
do MVP (10 empresas em cada). Não precisa instalar MySQL/Postgres — é só
um arquivo, o backend já sabe onde ele está.

Pra gerar dados novos (ex: mais empresas, outra distribuição): editem e
rodem de novo `backend/gerar_banco.py` (precisa de Python 3).
