// Persistência da última configuração usada.
const CHAVE = "volumetria:config";
const CHAVE_ANTIGA = "config";

export function carregarConfig() {
  try {
    const bruto = localStorage.getItem(CHAVE) ?? localStorage.getItem(CHAVE_ANTIGA);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function salvarConfig(config) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(config));
  } catch {
    // localStorage indisponível (modo privado, quota): segue sem persistir.
  }
}
