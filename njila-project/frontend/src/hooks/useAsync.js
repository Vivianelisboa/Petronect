import { useCallback, useEffect, useState } from "react";

/**
 * Executa uma função assíncrona e expõe um estado de requisição padronizado:
 * `{ dados, carregando, erro, recarregar }`. `deps` funciona como o array de
 * dependências do `useEffect` — quando muda, a busca é refeita.
 *
 * É a base de todos os hooks de dados, para que nenhuma feature precise
 * reimplementar `useState + useEffect + try/catch`.
 */
export function useAsync(fn, deps = []) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const executar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await fn();
      setDados(resultado);
      return resultado;
    } catch (e) {
      setErro(e);
      return null;
    } finally {
      setCarregando(false);
    }
  }, deps);

  useEffect(() => {
    executar();
  }, [executar]);

  return { dados, carregando, erro, recarregar: executar };
}
