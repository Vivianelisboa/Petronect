const test = require("node:test");
const assert = require("node:assert/strict");
const {
  PERFIS,
  PRIORIDADES,
  classificarPerfil,
  gerarMensagemReengajamento,
} = require("./relatorio.js");

test("classifica como Ativo quem acessou nos últimos 7 dias com frequência alta", () => {
  assert.equal(classificarPerfil({ diasSemAcesso: 7, frequenciaSemanal: 4 }), "Ativo");
  assert.equal(classificarPerfil({ diasSemAcesso: 0, frequenciaSemanal: 10 }), "Ativo");
});

test("classifica como Novo quem acessou nos últimos 7 dias com frequência baixa", () => {
  assert.equal(classificarPerfil({ diasSemAcesso: 7, frequenciaSemanal: 3 }), "Novo");
  assert.equal(classificarPerfil({ diasSemAcesso: 1, frequenciaSemanal: 0 }), "Novo");
});

test("classifica como Em Risco quem ficou entre 8 e 30 dias sem acesso", () => {
  assert.equal(classificarPerfil({ diasSemAcesso: 8, frequenciaSemanal: 0 }), "Em Risco");
  assert.equal(classificarPerfil({ diasSemAcesso: 30, frequenciaSemanal: 0 }), "Em Risco");
});

test("classifica como Inativo quem ficou mais de 30 dias sem acesso", () => {
  assert.equal(classificarPerfil({ diasSemAcesso: 31, frequenciaSemanal: 0 }), "Inativo");
});

test("prioridade de reengajamento: Inativo primeiro, Ativo por último", () => {
  assert.equal(PRIORIDADES.Inativo, 1);
  assert.equal(PRIORIDADES["Em Risco"], 2);
  assert.equal(PRIORIDADES.Novo, 3);
  assert.equal(PRIORIDADES.Ativo, 4);
});

test("mensagem de Ativo elogia o engajamento e usa o primeiro termo do nome", () => {
  const mensagem = gerarMensagemReengajamento({ nome: "Costa Serviços", perfil: "Ativo", diasSemAcesso: 2 });
  assert.ok(mensagem.startsWith("Olá, Costa!"));
  assert.match(mensagem, /engajados/);
});

test("mensagem de Novo dá boas-vindas com guia rápido", () => {
  const mensagem = gerarMensagemReengajamento({ nome: "Global Máquinas", perfil: "Novo", diasSemAcesso: 3 });
  assert.ok(mensagem.startsWith("Olá, Global!"));
  assert.match(mensagem, /guia rápido/);
});

test("mensagem de Em Risco e Inativo citam os dias sem acesso", () => {
  const emRisco = gerarMensagemReengajamento({ nome: "Norte Peças", perfil: "Em Risco", diasSemAcesso: 12 });
  assert.match(emRisco, /12 dias/);

  const inativo = gerarMensagemReengajamento({ nome: "Sul Logística", perfil: "Inativo", diasSemAcesso: 45 });
  assert.match(inativo, /45 dias/);
  assert.match(inativo, /Sentimos sua falta/);
});

test("PERFIS expõe os quatro perfis de engajamento", () => {
  assert.deepEqual(PERFIS, ["Ativo", "Novo", "Em Risco", "Inativo"]);
});
