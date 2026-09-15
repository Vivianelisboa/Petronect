# Design — Plano de UI/UX da Aplicação Njila

Plano de design da **aplicação** (painel operacional + Paola). Documento de
trabalho: define o DNA visual, os tokens, a regra de UX/UI e o desenho de cada
seção. Complementa `UI-UX.md` (benchmarking, vocabulário, arquitetura de
informação).

Referências de design: **Brevo** (estrutura SaaS), **Ruul** (minimalismo
editorial) e **tbh / Studiovoilà** (calor humano).

> **Pendência:** a **logo** define o acento de marca e a tipografia. Até ela
> chegar, `brand` (verde) é provisório.

---

## 1. DNA das referências → regras para a aplicação

| Referência | Traz | Vira, na aplicação |
|---|---|---|
| **Brevo** | Estrutura clara, blocos, cards com ícone, muito respiro | Seccionamento das telas, linguagem de card, agrupamento por tarefa |
| **Ruul** | Base preto/branco, tipografia forte, passos numerados `[01]`, tom curto e direto | Hierarquia por peso, contenção de cor, ritmo, microcopy direta |
| **tbh / voilà** | Calor humano, ícone + título + 1 linha, tags, storytelling | Humanizar a jornada (timeline, estados vazios), ícones, tom acolhedor |

**Síntese:** estrutura do Brevo + contenção do Ruul + calor do tbh.

---

## 2. Tokens

| Token | Decisão | Origem |
|---|---|---|
| Base neutra | branco / slate (fundo); grafite para texto | Ruul |
| Acento de marca | **1 cor** (definida pela logo) — usada só em ação/estado | Ruul |
| Status | semânticos: neutro · info · atenção · crítico · sucesso | já implementado |
| Tipografia | sans, títulos pesados; **números tabulares** em dados | Ruul + dados |
| Escala de espaço | múltiplos de 4; generoso no respiro, contido na densidade | Brevo |
| Forma | cantos arredondados médios; cards com sombra suave | Brevo |
| Movimento | **snap** (instantâneo); nada que atrase a leitura | Linear/Vercel |

Fonte única: `frontend/src/design/tokens.js` (o Tailwind importa daqui).

---

## 3. Shell da aplicação

- **Cabeçalho:** marca (logo + wordmark) à esquerda; sem ruído.
- **Navegação:** 2 destinos — `Fila de Hoje` · `Assistente`. Item ativo com
  sublinhado no acento de marca.
- **Conteúdo:** largura máxima por tela; a Fila usa largura cheia, a Ficha e a
  Paola usam coluna centrada.
- **Futuro:** barra de comando (⌘K) e contagem no título da aba.

---

## 4. Seção — Fila de Hoje

**Pergunta:** *quem precisa de atenção agora?*

### Estrutura
1. **Resumo (hero)** — 3–4 números grandes, tabulares: `Críticos` ·
   `Em atendimento` · `Aguardando 1ª ação`. Sem gráficos decorativos.
2. **Triagem** — controle segmentado por *Situação*: Pendente · Em atendimento
   · Adiado · Resolvido.
3. **Filtro de momento** — secundário, à direita do título.
4. **Lista** — o produto ordena por prioridade.

### Card-caso (unidade da lista)
- Empresa em destaque + segmento (linha de apoio).
- Selos: **momento** e **situação**.
- **Prioridade**: número + banda + **evidência** (chips dos fatores).
- Último acesso / tempo parado.
- **Próximo passo**: 1 ação primária + menu de ações (mensagem, tutorial,
  encaminhar, resolver, adiar).
- **Mini-jornada**: as 6 etapas como trilha, mostrando onde parou.

### Estados
- **Carregando:** skeleton da lista (não spinner).
- **Vazio:** funcional e caloroso (tbh) — "nada pendente aqui".
- **Erro:** mensagem clara + tentar de novo.
- **Pico:** mesma hierarquia sob volume alto.

### Regras
- O produto ordena; filtro é secundário.
- 1 ação primária por card; o resto vai para o menu.
- Evidência sempre visível — nunca só o número.

---

## 5. Seção — Ficha da Empresa

**Pergunta:** *o que aconteceu e qual o próximo passo?*

### Estrutura
1. **Voltar** — "← Fila de Hoje" (é detalhe, não aba).
2. **Cabeçalho** — nome, CNPJ mascarado, segmento, momento, prioridade.
3. **Próximo passo** — card com 1 ação primária e um "por que agora".
4. **Fatos** — grade: primeiro acesso, primeiro clique, frequência de retorno,
   última visita, páginas acessadas, oportunidades visualizadas.
5. **Linha do tempo** — memória da conta: agrupada por dia, ícones de status,
   distinção **sistema vs humano**.
6. **Registro de intervenções** — quem, ação, data, mensagem, se retornou, se
   concluiu.

### Regras
- Fatos em grade compacta (tabular), não em parágrafos.
- Timeline com ícones e rótulos curtos (tbh); nunca texto cru sem hierarquia.
- O "por que agora" liga com a explicação do score.

---

## 6. Seção — Paola (visão do fornecedor)

**Papel:** simulação da Paola integrada ao Njila. Uma **única superfície**.

### Estrutura
1. **Faixa de demonstração** — deixa claro que é a visão do fornecedor.
2. **Seletor de empresa** — para simular o login.
3. **Widget Paola:**
   - Header com estado: **Paola · Assistente virtual** → **Paola · Atendimento**
     ao transferir.
   - **Gatilho proativo** do Njila como primeira mensagem.
   - **Ações** tipadas: ação · ajuda · handoff · dispensar.
   - **"Por que estou vendo isto?"** expõe a regra (momento da jornada).
   - **Conversa** e **handoff** no mesmo fio — nunca um segundo chat.

### Regras
- Uma voz só. Sem chat concorrente.
- Proatividade contida: 1 alerta por vez; "Agora não" silencia e não repete.
- Bot ↔ humano sempre explícito no header.

---

## 7. Regras de UX/UI transversais

1. **Uma pergunta por seção.**
2. **Hierarquia por peso e tamanho**, não por cor.
3. **Processos numerados** `[01][02][03]` quando forem sequência.
4. **Padrão de card** = ícone + título + 1 linha + corpo.
5. **Prova antes do pedido** (quando houver CTA).
6. **Um CTA por seção**, verbo direto.
7. **Acento só em ação/estado.**
8. **Movimento snap** — nada que atrase.
9. **Estados vazios/loading/erro desenhados.**
10. **Tokens semânticos** como fonte única.

### Acessibilidade
- Contraste AA; foco visível (anel); alvos ≥ 44px; rótulos `aria` em ícones e
  selos (ex.: prioridade tem `aria-label` com banda + valor).

---

## 8. Pendências

- [ ] **Logo** → define acento de marca e tipografia.
- [ ] Ações tipadas no backend (ação/ajuda/handoff/dispensar).
- [ ] Supressão ("Agora não" persistente).
- [ ] Direção da prioridade (↑/↓) — requer histórico de score.
