/**
 * i18n.js — configuração do i18next.
 * Hoje só temos pt-BR (é o idioma real de uso do Portal), mas a estrutura
 * já permite adicionar outros idiomas depois: basta criar o arquivo em
 * src/locales/<idioma>.json e registrar aqui em `resources`.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./locales/pt-BR.json";

i18n.use(initReactI18next).init({
  resources: { "pt-BR": { translation: ptBR } },
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: { escapeValue: false },
});

export default i18n;
