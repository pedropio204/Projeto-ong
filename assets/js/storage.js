const STORAGE_KEYS = {
  DOACOES: 'ong_doacoes',
  VOLUNTARIOS: 'ong_voluntarios',
  TEMA: 'ong_tema'
};

export function salvarRegistro(chave, dados) {
  try {
    const registros = obterRegistros(chave);
    registros.push({ ...dados, id: Date.now() });
    localStorage.setItem(chave, JSON.stringify(registros));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar no localStorage (${chave}):`, error);
    return false;
  }
}

export function obterRegistros(chave) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error(`Erro ao ler localStorage (${chave}):`, error);
    return [];
  }
}

export function salvarPreferencia(chave, valor) {
  localStorage.setItem(chave, valor);
}

export function obterPreferencia(chave) {
  return localStorage.getItem(chave);
}

export { STORAGE_KEYS };