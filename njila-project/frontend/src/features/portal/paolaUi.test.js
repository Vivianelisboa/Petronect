import test from "node:test";
import assert from "node:assert/strict";
import { saudacaoPorPerfil, responderOffline } from "./paolaUi.js";

test("saudação do fornecedor menciona a cotação em andamento e traz ações", () => {
  const { texto, acoes } = saudacaoPorPerfil("fornecedor");

  assert.match(texto, /cotação/i);
  assert.ok(acoes.includes("Continuar cotação"));
  assert.ok(acoes.includes("Falar com Atendimento"));
});

test("saudação do cliente fala de pedidos e contratos", () => {
  const { texto, acoes } = saudacaoPorPerfil("cliente");

  assert.match(texto, /pedido/i);
  assert.deepEqual(acoes, []);
});

test("saudação do novo orienta o cadastro", () => {
  const { texto } = saudacaoPorPerfil("novo");

  assert.match(texto, /cadastro/i);
});

test("saudação sem perfil é genérica", () => {
  const { texto } = saudacaoPorPerfil(null);

  assert.match(texto, /Paola/i);
});

test("responderOffline fala de cadastro quando a pergunta menciona cadastro", () => {
  assert.match(responderOffline("onde atualizo meu cadastro?"), /cadastro/i);
});

test("responderOffline fala de oportunidades em perguntas de cotação/proposta", () => {
  assert.match(responderOffline("quero retomar minha proposta"), /oportunidade/i);
});

test("responderOffline fala de pagamento em perguntas de pagamento/taxa", () => {
  assert.match(responderOffline("como pago a taxa?"), /pagamento/i);
});

test("responderOffline encaminha ao Atendimento em perguntas de atendimento/pessoa", () => {
  assert.match(responderOffline("quero falar com alguém do atendimento"), /Atendimento/i);
});

test("responderOffline cobre qualquer outra pergunta com as áreas do portal", () => {
  assert.match(responderOffline("o que você pode fazer?"), /cadastro|oportunidades|propostas|pagamentos|Atendimento/);
});
