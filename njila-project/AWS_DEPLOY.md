# Colocando a Njila na AWS

## 1. Onde fica o banco de dados hoje vs. em produção

**Hoje (protótipo/demo):** o banco é um arquivo único, `njila.db` (SQLite),
que vive dentro da pasta `backend/`. Não precisa de servidor de banco
rodando — é só um arquivo. Ótimo para a demo do hackathon: zero configuração.

**Em produção na AWS**, esse arquivo tem uma limitação: o Lambda (onde o
backend serverless roda) tem sistema de arquivos **efêmero** — ou seja, se
alguém registrar uma ação (POST `/empresa/:id/acao`), isso pode não persistir
entre execuções diferentes da função. Para resolver isso de verdade, existem
2 caminhos:

### Opção A — Amazon RDS (Postgres) — recomendado
Um banco de dados relacional "de verdade", gerenciado pela AWS.

**Passo a passo:**
1. No console da AWS, vá em **RDS → Create database**
2. Escolha **PostgreSQL**, template **Free tier** (para teste/hackathon)
3. Defina usuário/senha, anote o **endpoint** gerado (algo como
   `njila-db.xxxxxxx.us-east-1.rds.amazonaws.com`)
4. Crie as mesmas tabelas que já temos no SQLite (`empresas`, `eventos`,
   `classificacao`, `acoes_registradas`) — o SQL é praticamente idêntico,
   só troca `AUTOINCREMENT` por `SERIAL` no Postgres
5. No backend, troque `node:sqlite` pelo pacote `pg`:
   ```bash
   npm install pg
   ```
6. Reescrevam só o `src/db.js` para usar `pg` em vez de `node:sqlite` — as
   funções (`getFilaHoje`, `getEmpresa`, `registrarAcao`, `getResumo`)
   continuam com a mesma assinatura, então **nenhum handler precisa mudar**
7. Guardem a string de conexão em **AWS Secrets Manager** (não deixem senha
   direto no código) e leiam via variável de ambiente na Lambda

### Opção B — Amazon DynamoDB (NoSQL, mais rápido de configurar)
Se preferirem não mexer com SQL: criem 2 tabelas DynamoDB
(`njila-empresas` com chave `empresa_id`, `njila-eventos` com chave
composta `empresa_id` + `timestamp`). O `aws-sdk` já vem disponível
nativamente dentro do runtime da Lambda, não precisa nem instalar.

**Para o hackathon**, se o tempo estiver curto: **fiquem com o SQLite
mesmo** e rodem o backend numa instância simples (mesmo que seja só o
`node server.js` local, ou numa EC2 t2.micro) — funciona perfeitamente
para uma demo e evita a complexidade extra de migrar banco sob pressão de
prazo. Migrem para RDS/DynamoDB depois, se o projeto seguir adiante.

---

## 2. Fazendo o deploy do backend na AWS Lambda

```bash
cd backend
npm install -g serverless
npm install
serverless deploy
```

Isso lê o `serverless.yml` que já está pronto na pasta e cria
automaticamente: 6 funções Lambda (uma por rota) + API Gateway conectando
tudo. No fim do comando, o terminal mostra a URL pública gerada, tipo:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com
```
Essa é a URL que o frontend vai usar em produção (troquem `VITE_API_URL`
no `.env` do frontend por ela).

**Pré-requisito:** ter uma conta AWS e rodar `aws configure` uma vez no
terminal, colando o Access Key ID e Secret Access Key (geram isso em
IAM → Users → Security credentials).

---

## 3. Alimentando o chatbot para ajudar os clientes de verdade

Hoje o Assistente (`src/assistente.js`) funciona **por regras**: ele olha
o momento da jornada da empresa e escolhe uma mensagem pronta — rápido,
previsível, sem custo de API externa, e é exatamente o que o documento do
MVP pede ("regras explicáveis"). Isso já é suficiente e o mais indicado
pra demo do hackathon.

Se depois do hackathon vocês quiserem evoluir para um chatbot que
**responde qualquer pergunta em texto livre** (não só as frases prontas),
o caminho natural na AWS é o **Amazon Bedrock**, que hospeda modelos como
o Claude (da Anthropic) prontos para uso via API, sem vocês terem que
treinar nada.

### Como conectar (visão geral)
1. Habilitem o modelo Claude no console do Bedrock (Model access)
2. No handler `handlers/chat.js`, troquem a chamada a
   `responderPerguntaLivre(mensagem)` por uma chamada ao Bedrock,
   passando como contexto os dados da ficha da empresa — isso é o que
   faz a resposta ser *personalizada* pra cada fornecedor:

```javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function responderComIA(mensagem, contextoEmpresa) {
  const prompt = `Você é o assistente da Petronect, ajudando a empresa
${contextoEmpresa?.nome || "o fornecedor"}, que está no momento
"${contextoEmpresa?.momento || "desconhecido"}" da jornada.
Responda de forma curta e direta à pergunta: "${mensagem}"`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
    contentType: "application/json",
  });

  const resposta = await client.send(command);
  const corpo = JSON.parse(new TextDecoder().decode(resposta.body));
  return corpo.content[0].text;
}
```

3. Isso mantém as mensagens *proativas* (as que aparecem sozinhas, tipo
   "vi que você não terminou seu cadastro") continuarem sendo por regra
   — são as mais importantes de serem 100% previsíveis — e só o *chat
   livre* passa a usar IA generativa de verdade.

### Sobre custo e segurança
- O Bedrock cobra por token processado — para o volume de um hackathon
  isso é centavos, mas em produção real vale colocar um limite de uso
  (Bedrock tem quotas configuráveis)
- Nunca chamem a API de IA direto do frontend (React) — sempre pelo
  backend, senão qualquer pessoa consegue ver e usar a chave de acesso
  de vocês pelo navegador

---

## 4. Resumo do que sobe onde

| Peça | Onde roda | Ferramenta |
|---|---|---|
| Frontend (React) | Amazon S3 + CloudFront (hospedagem estática) ou Vercel/Netlify (mais simples pra demo) | `npm run build` gera a pasta `dist/`, é só subir os arquivos estáticos |
| Backend (API) | AWS Lambda + API Gateway | `serverless deploy` |
| Banco de dados | RDS (Postgres) ou DynamoDB | Ver seção 1 |
| Chatbot com IA (opcional, futuro) | AWS Bedrock, chamado pela própria Lambda do backend | Ver seção 3 |

Para o hackathon, o mais seguro é: **backend rodando local (`node server.js`)
+ frontend rodando local (`npm run dev`)**, e mostrarem tudo funcionando
ao vivo na tela durante o pitch. Deploy na AWS de verdade só se sobrar
tempo — não é obrigatório pelos critérios da banca (eles pedem "protótipo
navegável ou demonstrável", que local já cumpre).
