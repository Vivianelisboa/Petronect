# Contrato de eventos de acesso

Ingestão de eventos **consentidos** de navegação do Portal Petronect. É a
fonte de dados do Njila: o comportamento do fornecedor vira insumo para o
score determinístico e, a partir dele, para a Central de Operações.

> Este endpoint só aceita **metadados de navegação**. Nunca senha, token,
> proposta, documento, CPF/CNPJ ou texto digitado em campos livres.

## Endpoint (demonstração)

```
POST /eventos
Content-Type: application/json
```

### Corpo

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `eventId` | UUID | sim | Identificador único do evento. |
| `anonymousId` | texto | sim | Pseudônimo técnico do navegador. |
| `empresaId` | texto | não | Contexto de demonstração. Em produção, a identidade vem da sessão autenticada no servidor. |
| `name` | enum | sim | Tipo de evento. |
| `path` | texto (`/`) | sim | Caminho acessado, começando com `/`. |
| `occurredAt` | ISO 8601 | sim | Momento do evento. |
| `consent` | `true` | sim | Consentimento explícito. Qualquer outro valor é rejeitado. |

### Tipos de evento (`name`)

- `page_view`
- `opportunity_opened`
- `proposal_started`
- `contract_opened`
- `payment_opened`

### Respostas

| Status | Significado | Corpo |
|---|---|---|
| `202` | Evento aceito | `{ "status": "accepted", "eventId": "..." }` |
| `400` | Evento inválido | `{ "erro": "Evento inválido.", "detalhes": ["..."] }` |

### Exemplo

```json
{
  "eventId": "09ec1605-138d-423a-9558-956203306b09",
  "anonymousId": "b0f1c2d3-...",
  "empresaId": "E049",
  "name": "opportunity_opened",
  "path": "/oportunidades/7004410",
  "occurredAt": "2026-09-15T17:08:46.771Z",
  "consent": true
}
```

## Regras de segurança e LGPD

Valem para o cliente e, obrigatoriamente, para o servidor — o cliente nunca
é fonte confiável:

- **Consentimento explícito** (`consent: true`) é exigido em cada evento.
- **Validação no servidor** de todos os campos, independentemente da
  validação já feita no front-end.
- **Campos proibidos** rejeitados por substring: `senha`, `password`,
  `token`, `segredo`, `secret`, `cpf`, `cnpj`, `proposta`, `documento`,
  `cartao`, `cvv`.
- **Identidade**: em produção, `empresaId`/`userId` devem vir da sessão
  autenticada (claims de JWT ou `x-ms-client-principal`), nunca do corpo.
- **Pseudonimização**: o `anonymousId` é só um pseudônimo técnico; a
  associação a uma identidade real acontece no servidor.
- **Retenção limitada**: cada evento recebe `expira_em` (90 dias) para
  descarte dos dados brutos.
- **CORS restrito** ao domínio do portal em produção, com autenticação e
  rate limiting no endpoint.

## Onde isto roda

- **Demonstração**: `handlers/eventos.js` no backend Node, com persistência
  em `eventos_acesso` (SQLite), incluindo `expira_em`.
- **Produção (referência)**: os exemplos serverless da versão
  *Petronect Insights* — `functions/aws` (Lambda + SAM + DynamoDB com TTL) e
  `functions/azure` (Azure Functions + Cosmos/Event Hubs) — implementam o
  mesmo contrato com validação Zod, `202`/`400` e CORS restrito. Devem ser
  adotados como caminho oficial de ingestão em nuvem.

## Cliente

`frontend/src/services/tracking.js` expõe `track({ name, path, empresaId })`:

1. recupera ou cria o `anonymousId` em `localStorage`;
2. monta o evento com `eventId`, `occurredAt` e `consent: true`;
3. valida com Zod antes de enviar;
4. envia para `/eventos` e **nunca bloqueia a interface** em caso de falha.

## Próximos passos

- Agregar os eventos brutos em score/jornada (hoje a classificação vem do
  seed) para fechar o ciclo: evento → score → Central → ação → histórico.
- Emitir eventos reais a partir da simulação do Portal do fornecedor.
