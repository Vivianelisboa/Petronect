# Benchmark de UI — Central de Operações

## Objetivo

Definir uma direção visual para o Njila que seja adequada ao hackathon:
reconhecível como parte do ecossistema Petronect, moderna o suficiente para
demonstrar produto, e gamificada apenas onde a mecânica melhora a decisão.

O usuário principal é a equipe de Marketing & Atendimento. A tarefa diária é
identificar fornecedores que precisam de intervenção, entender o motivo e
executar a próxima ação com segurança.

## Diagnóstico executivo

A interface atual tem bons elementos isolados, mas ainda mistura três modelos:

- portal corporativo tradicional;
- dashboard de métricas;
- sistema de missões gamificado.

Essa mistura reduz a sensação de acabamento. O caminho recomendado é escolher
um modelo principal: **central operacional orientada a decisões**, usando
gamificação como camada de progresso, não como tema visual.

### O que deve permanecer

- verde Petronect para progresso, conclusão e saúde positiva;
- azul corporativo para ação e navegação, quando confirmado no guia visual da
  marca;
- Garet somente na marca;
- Inter para leitura e operação;
- jornada do fornecedor como modelo de domínio;
- prioridade calculada e explicável;
- uma ação principal por empresa.

### O que deve sair

- contadores coloridos sem consequência clara;
- quatro filtros apresentados como “mini dashboards” independentes;
- badges longos competindo com o nome da empresa;
- emoji, troféus ou estética de videogame;
- anel de prioridade isolado sem explicar o que fazer;
- excesso de bordas e caixas;
- sidebar ou navegação que ocupa espaço sem representar uma tarefa real.

## Referências analisadas

### Petronect e Minha Petronect

Fontes:

- [Minha Petronect](https://minhapetronect.com.br/)
- [Conheça a Minha Petronect](https://www.petronect.com.br/irj/go/km/docs/pccshrcontent/Site%20Content%20(Legacy)/Portal2018/pt/conheca-minha-petronect.html)
- [Material de treinamento Minha Petronect](https://www.petronect.com.br/irj/go/km/docs/documents/Petronect/Conteudo_Publico/por/GuiasRapidos/guias/Material_Treinamento_Minha_Petronect%20v2_1499.pdf)
- [Apresentação institucional Petronect](https://canalfornecedor.petrobras.com.br/documents/d/canal-do-fornecedor/apresentacao-firjan-petronect?download=true)

Insights confiáveis para o Njila:

- A Minha Petronect se posiciona como apoio estratégico ao fornecedor, não
  como substituição do Portal Petronect.
- O valor central é transformar histórico, oportunidades e desempenho em
  decisões melhores.
- A linguagem da marca é simples, prática, estratégica e conectada ao processo
  do fornecedor.
- A interface do Njila deve parecer uma camada inteligente de operação dentro
  desse ecossistema, não um produto visualmente independente.
- A marca precisa transmitir confiança, conformidade, simplicidade e agilidade
  antes de transmitir diversão.

Limitação: o portal público Petronect usa infraestrutura SAP e parte das
páginas não carregou durante a pesquisa. Por isso, não tratamos detalhes
visuais não verificáveis como regra de marca. A decisão de cor deve ser
validada com o material oficial disponível à equipe.

### SAP Fiori List Report

Fonte: [SAP Fiori List Report Floorplan](https://www.sap.com/design-system/fiori-design-web/v1-145/page-types/floorplans/list-report-floorplan-sap-fiori-element/usage)

O padrão é relevante porque o Portal Petronect tem origem SAP e o Njila lida
com uma coleção operacional de empresas.

O que aproveitar:

- cabeçalho identifica claramente a visão inteira;
- filtros ficam juntos em uma barra coerente;
- filtros aplicados precisam corresponder exatamente ao conteúdo exibido;
- estados pré-filtrados podem ser tratados como visões da mesma coleção;
- a quantidade de itens deve aparecer na visão;
- ações globais ficam separadas das ações da empresa;
- detalhe deve ser um drill-down claro para uma ficha.

O que não copiar:

- densidade visual de uma tabela SAP;
- excesso de filtros no primeiro nível;
- nomenclatura técnica;
- aparência de sistema legado.

### Salesforce Path

Fonte: [Salesforce Progress Indicator](https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-progress-indicator.html)

O componente Path representa um processo comercial em etapas, com estados
concluídos, atual e próximos passos. É a melhor referência para a
`MiniJornada` do Njila.

Aplicação no Njila:

- etapas anteriores recebem marca de conclusão;
- etapa atual tem maior peso visual;
- etapas futuras ficam presentes, mas silenciosas;
- o próximo passo é textual e acionável;
- a trilha não deve ser apenas decoração.

### Atlassian Design System

Fonte: [Atlassian Lozenge](https://atlassian.design/components/lozenge)

O lozenge existe para comunicar um atributo que altera como o usuário entende,
prioriza ou age sobre um objeto.

Aplicação no Njila:

- usar badges para `Situação` e, no máximo, `Momento`;
- manter rótulos curtos;
- nunca usar badge para frases inteiras;
- não depender apenas da cor: o texto precisa carregar o significado;
- prioridade deve ficar separada de status.

### Linear

Fonte: [Linear](https://linear.app/)

O padrão de referência é uma superfície de trabalho opinativa: poucos
elementos no primeiro nível, alta legibilidade e detalhes revelados quando
necessários.

Aplicação no Njila:

- mostrar primeiro o que precisa de decisão;
- esconder ações secundárias no menu;
- evitar transformar a Central em relatório analítico;
- usar espaço e alinhamento para hierarquia, não apenas cor;
- manter a lista ou grade com uma lógica de leitura previsível.

### Intercom e ferramentas operacionais

Fontes de referência:

- [Intercom](https://www.intercom.com/)
- [Priority-Based Task Queue](https://www.shadcn.io/blocks/crud-priority-queue)
- [Carbon Filtering](https://carbondesignsystem.com/patterns/filtering/)

Padrões úteis:

- contagem de itens abertos deve levar diretamente à lista filtrada;
- cada item precisa trazer um resumo suficiente para decidir se vale abrir;
- o filtro ativo precisa ser visualmente inequívoco;
- ações de alto uso ficam visíveis; ações secundárias ficam no overflow;
- filtros devem oferecer limpeza clara e não se espalhar em controles soltos.

## Benchmark de gamificação corporativa

### Gamificação que vale usar

As referências de onboarding e adoção corporativa convergem em uma ideia:
gamificação eficaz muda comportamento real. Ela não transforma o sistema em um
videogame.

Fontes:

- [Gamification Patterns for SaaS](https://dev.to/gerus_team/5-gamification-patterns-that-actually-move-saas-metrics-not-just-vanity-numbers-3h95)
- [EngageFabric Quest-Based Onboarding](https://engagefabric.com/blog/signup-to-power-user-onboarding-playbook)
- [Databricks Quest](https://github.com/databricks-solutions/databricks-quest)

Mecânicas recomendadas:

1. **Progresso de jornada**: mostrar o avanço do fornecedor nas etapas reais.
2. **Próxima missão**: destacar uma ação concreta, não uma pontuação abstrata.
3. **Marcos de conclusão**: reconhecer uma fila limpa, uma etapa concluída ou
   uma recuperação de fornecedor.
4. **Progresso coletivo**: comunicar o avanço da operação, não ranquear pessoas.
5. **Urgência calculada**: score e tempo parado devem refletir o estado atual.
6. **Feedback de conclusão**: a empresa muda de estado e o operador entende o
   resultado imediatamente.

### Mecânicas que devemos evitar

- leaderboard individual;
- XP sem relação com resultado operacional;
- streak diário, porque o trabalho não tem necessariamente uma cadência
  diária uniforme;
- confetes, emojis e prêmios cosméticos;
- pontos negativos por atraso;
- níveis que escondem o significado real da prioridade.

## Diagnóstico da interface atual

### Problema 1: filtros parecem métricas, não controles

Os cards de `Críticas`, `Aguardando 1ª ação`, `Em atendimento` e `Concluídas`
possuem cores e números, mas ainda não deixam claro que são visões acionáveis.

Direção:

- tratar cada item como uma aba de status com contador;
- manter um único estado selecionado;
- usar uma barra inferior ou destaque interno, não escala e ring externos;
- deixar claro quantos resultados estão sendo mostrados;
- abreviar visualmente o texto sem perder o label acessível.

Rótulos recomendados:

- `Críticas`
- `Primeira ação pendente`
- `Em atendimento`
- `Concluídas`

### Problema 2: gamificação está espalhada

Hoje há contador, anel, badges, ícones e trilha competindo pela atenção. A
gamificação precisa ter uma âncora.

Direção:

- âncora: **trilha da jornada**;
- prioridade: risco operacional;
- cor: estado semântico;
- ação: próxima missão;
- contador: saúde da Central.

Cada elemento precisa responder a uma pergunta diferente:

| Elemento | Pergunta respondida |
|---|---|
| Filtro | Qual grupo devo trabalhar? |
| Ícone | Que momento ocorreu? |
| Jornada | Onde o fornecedor parou? |
| Prioridade | Qual risco exige atenção primeiro? |
| Ação | O que faço agora? |

### Problema 3: card ainda parece composição de componentes

O card precisa ser lido como uma unidade, não como ícone + badges + ring + texto
independentes.

Direção do card final:

- topo: ícone do momento, empresa e prioridade;
- meio: uma frase de contexto e a jornada;
- rodapé: próxima ação como chamada principal;
- situação como pequeno lozenge;
- ações secundárias no menu;
- uma única cor de destaque por card.

### Problema 4: logo tem símbolo, mas não tem sistema

O caminho gráfico deve aparecer no logo e reaparecer com moderação na jornada.
Ele não deve virar um ícone decorativo em todos os lugares.

Direção:

- símbolo próprio com três pontos e um caminho contínuo;
- `njila` em Garet Book;
- `portal` em Inter semibold;
- mesma geometria de nós/conectores na trilha da jornada;
- verde no símbolo e em progresso; azul apenas em ação, se validado como cor
  oficial.

## Direção visual final recomendada

### Estrutura da Central

```text
Marca + navegação
        ↓
Central de Operações       [momento: todos]
Quem precisa de decisão agora
        ↓
Visões de status com contadores
        ↓
Cards de fornecedores em 2 colunas
        ↓
Ficha como aprofundamento
```

### Sistema de cor

- fundo: neutro quase branco;
- superfície: branco;
- texto: slate escuro;
- verde Petronect: conclusão, progresso, saúde;
- azul corporativo: ação, links e foco, após validação da cor oficial;
- vermelho/âmbar: somente risco e urgência reais.

### Sistema de movimento

- filtro: mudança imediata de estado, sem animação chamativa;
- card: elevação de 1–2 px no hover;
- ação: mudança otimista de estado + toast curto;
- conclusão: progresso da jornada atualiza no próprio card;
- evitar animações decorativas e efeitos de “jogo”.

## Critérios de aprovação do hackathon

O protótipo está pronto quando:

- uma pessoa identifica a ação mais urgente em menos de 5 segundos;
- entende que os quatro blocos superiores são filtros clicáveis;
- identifica o próximo passo sem abrir a ficha;
- entende a jornada sem legenda externa;
- reconhece a marca Njila sem confundi-la com um produto genérico de IA;
- percebe a conexão com Petronect pela paleta, tom e linguagem de fornecedor;
- consegue demonstrar uma ação completa: filtrar, escolher empresa, agir e ver o
  progresso mudar.

## Fontes consultadas

- [Minha Petronect](https://minhapetronect.com.br/)
- [SAP Fiori List Report](https://www.sap.com/design-system/fiori-design-web/v1-145/page-types/floorplans/list-report-floorplan-sap-fiori-element/usage)
- [Salesforce Progress Indicator](https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-progress-indicator.html)
- [Atlassian Lozenge](https://atlassian.design/components/lozenge)
- [Carbon Filtering](https://carbondesignsystem.com/patterns/filtering/)
- [Linear](https://linear.app/)
- [Intercom](https://www.intercom.com/)
- [Gamification Patterns for SaaS](https://dev.to/gerus_team/5-gamification-patterns-that-actually-move-saas-metrics-not-just-vanity-numbers-3h95)
- [EngageFabric Quest-Based Onboarding](https://engagefabric.com/blog/signup-to-power-user-onboarding-playbook)
