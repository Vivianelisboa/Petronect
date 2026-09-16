# njila-project — Backend + Frontend

Backend (Node.js serverless + SQLite) e frontend (React + Vite + Tailwind)
da Plataforma Njila. Consulte o README da raiz do repositório para o guia
simplificado de como rodar.

## Estrutura

```
njila-project/
├── backend/
│   ├── njila.db            # banco SQLite (gerado por `npm run seed`)
│   ├── gerar_banco.py      # gera os dados de demonstração (Python 3)
│   ├── src/
│   │   ├── db.js           # acesso ao banco + indicadores + engajamento
│   │   ├── assistente.js   # motor de regras do chatbot (Paola)
│   │   └── relatorio.js    # classificação de engajamento (radar Pulso)
│   ├── handlers/           # um arquivo por rota (padrão serverless)
│   ├── server.js           # servidor local (Node nativo, porta 3000)
│   └── serverless.yml      # deploy AWS
├── frontend/
│   └── src/
│       ├── app/            # layout da Central (AppShell + Header)
│       ├── features/       # fila, ficha, assistente, analitico, portal
│       ├── design/         # tokens + componentes de UI
│       ├── domain/         # ações, mensagens, momentos, situação
│       ├── services/       # clientes da API com validação Zod
│       └── hooks/          # carregamento das rotas
└── functions/              # exemplos AWS Lambda / Azure Functions
```

## Como rodar

```bash
# backend (porta 3000)
cd backend
npm run seed
npm start

# frontend (porta 5173), em outro terminal
cd frontend
npm install
npm run dev
```

## Testes

```bash
cd backend && npm test
cd frontend && npm test
```
