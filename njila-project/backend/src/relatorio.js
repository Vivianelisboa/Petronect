/**
 * src/relatorio.js
 * Radar de reengajamento do Njila. Classifica fornecedores por perfil de
 * engajamento (mesma regra do Pulso: recência + frequência) e gera a
 * mensagem personalizada para o time de Marketing. Funções puras — sem
 * acesso a banco — para serem testáveis isoladamente.
 */

const PERFIS = ["Ativo", "Novo", "Em Risco", "Inativo"];

const PRIORIDADES = {
  Inativo: 1,
  "Em Risco": 2,
  Novo: 3,
  Ativo: 4,
};

/**
 * Classifica o perfil de engajamento de um fornecedor.
 * - Ativo: acessou nos últimos 7 dias e com frequência >= 4x/semana.
 * - Novo: acessou nos últimos 7 dias, mas com frequência menor.
 * - Em Risco: sem acesso entre 8 e 30 dias.
 * - Inativo: sem acesso há mais de 30 dias.
 */
function classificarPerfil({ diasSemAcesso, frequenciaSemanal }) {
  if (diasSemAcesso <= 7 && frequenciaSemanal >= 4) return "Ativo";
  if (diasSemAcesso <= 7) return "Novo";
  if (diasSemAcesso <= 30) return "Em Risco";
  return "Inativo";
}

/**
 * Mensagem personalizada de reengajamento. O tom segue o do Pulso
 * (marketing, acolhedor), usando o primeiro termo do nome do fornecedor.
 */
function gerarMensagemReengajamento({ nome, perfil, diasSemAcesso }) {
  const primeiro = nome.trim().split(/\s+/)[0];

  if (perfil === "Ativo") {
    return `Olá, ${primeiro}! Você é um dos nossos fornecedores mais engajados. ` +
      "Confira as novidades que preparamos especialmente para quem, como você, " +
      "aproveita ao máximo o Portal Petronect.";
  }

  if (perfil === "Novo") {
    return `Olá, ${primeiro}! Que bom ter você no Portal Petronect. ` +
      "Preparamos um guia rápido para você explorar tudo que a plataforma oferece " +
      "e aproveitar ao máximo desde o início.";
  }

  if (perfil === "Em Risco") {
    return `Olá, ${primeiro}! Notamos que faz ${diasSemAcesso} dias desde sua última visita ao Portal. ` +
      "Tem novidades esperando por você, que tal dar uma olhada? " +
      "Estamos aqui se precisar de ajuda.";
  }

  return `Olá, ${primeiro}! Sentimos sua falta no Portal Petronect. ` +
    `Faz ${diasSemAcesso} dias desde seu último acesso. ` +
    "O portal evoluiu muito, gostaríamos de te mostrar o que mudou. " +
    "Posso te ajudar a retomar?";
}

module.exports = { PERFIS, PRIORIDADES, classificarPerfil, gerarMensagemReengajamento };
