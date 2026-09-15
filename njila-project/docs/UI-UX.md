# UI/UX — Benchmarking, princípios e vocabulário

Documento de referência do trabalho de UI/UX da Plataforma Njila.
Registra o benchmarking, os princípios adotados, o vocabulário canônico e a
arquitetura de informação — para as decisões não se perderem entre sessões.

Base: `MVP - Njila (Hackaton Petronect).pdf` (visão geral, painel operacional,
Fila de Hoje, Ficha da empresa, Funcionalidade 1 — Score, Funcionalidade 2 —
Assistente).

---

## 1. Benchmarking

| Referência | Lição central |
|---|---|
| [Linear Triage](https://linear.app/docs/triage) · [Triage Intelligence](https://linear.app/now/how-we-built-triage-intelligence) | Separar "não revisado" do trabalho ativo; prioridade + SLA ordenam; **snooze**; sugestões com **raciocínio visível**, distintas do que é humano/regra |
| [Intercom Inbox](https://www.intercom.com/help/en/articles/6603905-how-to-find-and-view-tickets-in-the-inbox) · [sorting](https://www.intercom.com/help/en/articles/6989006-inbox-sorting) | Lista é superfície de decisão; ordenar por **waiting since**; estados open/snoozed/closed; **macros** (ação em 1 clique); views = filtros salvos |
| [Basedash](https://www.basedash.com/blog/how-to-build-a-customer-health-score-signals-weighting-and-sql) · [Helix](https://helix.tray.ai/guides/customer-health-dashboard/) · [Lovable](https://lovable.dev/templates/apps/internal-tools/customer-health-dashboard-template) | **O valor é a explicação, não o número**; mostrar top-3 drivers; banda → playbook; **direção importa mais que nível**; ranquear por valor em risco; separar sinais em categorias |
| [Cloudscape — Timeline](https://cloudscape.design/gen-ai/patterns/timeline-overview/) · [shadcn activity log](https://www.shadcn.io/blocks/account-activity-log) | Timeline = **memória da conta**; agrupar por dia; ícones de status; distinguir **sistema vs humano**; entradas clicáveis |
| [The Anti-Dashboard](https://brainy.ink/paper/the-anti-dashboard) · [Vercel/Stripe](https://www.aydesign.ai/blog/best-ai-dashboard-examples-2026) | **Uma tela = uma pergunta**; o produto ordena (não o usuário); todo número ligado a uma ação; densidade **com** hierarquia; status visível sem foco; empty states funcionais; Cmd+K |

---

## 2. Princípios adotados

1. **Uma pergunta por superfície.** Fila = "quem precisa de atenção agora?"; Ficha = "o que aconteceu e qual o próximo passo?".
2. **O produto ordena, não o usuário.** A prioridade define a ordem; filtro é secundário.
3. **Todo registro tem evidência.** Nunca só o número: os fatores que o produziram.
4. **Toda linha termina numa ação.** E registrar a ação muda a situação.
5. **Triagem como camada.** Pendente → Em atendimento → Adiado → Resolvido.
6. **Assistente com raciocínio visível**, separado do que é regra determinística.

---

## 3. Vocabulário canônico

A confusão central era usar "momento", "status" e "etapa" como sinônimos.
São **dois eixos diferentes**:

### Eixo 1 — Jornada (o que a empresa fez) — diagnóstico
- **Jornada** — o caminho completo do fornecedor no Portal.
- **Momento** — a classificação atual da empresa. 6 valores:
  `chegou_perdeu`, `parou_cadastro`, `quis_participar_travou`,
  `era_ativa_sumiu`, `oportunidade_quente`, `jornada_concluida`.
- **Etapa** — o passo concreto onde parou (ex.: "pagamento da taxa").

### Eixo 2 — Atendimento (o que nós fizemos) — operacional
- **Situação** — estado do caso para a equipe:
  - **Pendente** — nenhuma ação registrada
  - **Em atendimento** — há ação registrada, sem retorno/conclusão
  - **Adiado** — última ação foi adiar
  - **Resolvido** — ação de resolução (ou empresa concluiu)
- **Prioridade** — o número (antes "score"), com banda e (futuro) direção.
  - Bandas: **Crítico** (≥80) · **Atenção** (60–79) · **Acompanhar** (40–59) · **Estável** (<40)
- **Próximo passo** — a ação recomendada (antes "ação recomendada"), sempre em 1 clique.

### Regra de nomes
- "score" só aparece na explicação/tooltip; na tela é **Prioridade**.
- "status" não é usado na interface; o termo é **Situação**.

---

## 4. Arquitetura de informação

```
PAINEL OPERACIONAL (Marketing / Atendimento)
├── Fila de Hoje — "quem precisa de atenção agora?"
│   ├── Resumo (hero): críticos · em atendimento · aguardando 1ª ação
│   ├── Segmentos de situação: Pendente · Em atendimento · Adiado · Resolvido
│   ├── Lista priorizada (o produto ordena)
│   │   └── Card-caso: empresa + momento + prioridade + evidência
│   │                  + último acesso + próximo passo + mini-jornada
│   └── Estados: carregando · vazio · erro · pico
└── Ficha da Empresa — "o que aconteceu e qual o próximo passo?"  (detalhe, não aba)
    ├── Cabeçalho: nome, CNPJ, momento, prioridade
    ├── Próximo passo recomendado + ação em 1 clique
    ├── Fatos: 1º acesso, 1º clique, frequência, última visita, páginas, oportunidades
    ├── Linha do tempo (memória da conta)
    └── Registro de intervenções (quem, ação, data, mensagem, retornou?, concluiu?)

TRANSVERSAL
└── Assistente do fornecedor — card proativo + chat (visão do Portal; modo demonstração)
```

**Navegação:** 2 destinos (`Fila de Hoje`, `Assistente`). A Ficha é detalhe,
alcançada a partir da Fila, com "← Fila de Hoje".

---

## 5. Inovações planejadas

1. Mini-jornada inline na Fila (mostra onde parou sem abrir a ficha).
2. Evidência como chips de fatores (recência · frequência · repetição · etapa · tempo parado).
3. Prioridade com direção (↑/↓) — **requer histórico de score** (não existe no banco; futuro).
4. Triagem com situação + adiar (dá um "fim" à fila).
5. "Por que agora" — uma linha justificando o próximo passo.
6. Contagem no título da aba (status visível sem foco).

---

## 6. Lacunas vs. MVP

| MVP pede | Estado |
|---|---|
| Fila: nome, momento, score, evidência, último acesso, próximo passo | evidência e último acesso já vêm da API; ajustar rótulos |
| Fila: status do atendimento | **implementado** como *Situação* (derivada do histórico) |
| Fila: ações (mensagem, tutorial, encaminhar, resolver, adiar) | só 2 hoje; completar na etapa de redesign |
| Ficha: 1º acesso, 1º clique, frequência, última visita, páginas, oportunidades | dados vêm na API, **não exibidos** ainda |
| Ficha: registro pós-intervenção (quem, se retornou, se concluiu) | parcial |
| Assistente: 3 exemplos (taxa, cadastro, inativo) | **cobertos** pelo motor de regras |

---

## 7. Log de decisões

| Decisão | Escolha |
|---|---|
| Estrutura do `src/` | feature-based + design system |
| Roteamento | react-router-dom |
| Data fetching | hooks próprios |
| Linguagem | JavaScript |
| Estado operacional | **Situação** (derivada do histórico, sem migração) |
| Rótulo do número | **Prioridade** |
| Navegação | 2 destinos; Ficha como detalhe |
