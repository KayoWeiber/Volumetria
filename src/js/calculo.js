// Regras de negócio: funções puras, sem acesso ao DOM.

export const TOLERANCIA_ML = 2;

// Mesmo arredondamento da versão original (toFixed(2)).
const arredondar = (n) => Number(n.toFixed(2));

export function calcularVolume(pesoCheio, { pesoLata, pesoTampa, densidade }) {
  return arredondar((pesoCheio - (pesoLata + pesoTampa)) / densidade);
}

export function calcularResultados(pesosCheios, config) {
  const volumes = pesosCheios.map((p) => calcularVolume(p, config));
  const soma = volumes.reduce((acc, v) => acc + v, 0);
  const volumeMedio = arredondar(soma / volumes.length);

  return {
    pesosCheios,
    volumes,
    volumeMedio,
    menorVolume: Math.min(...volumes),
    maiorVolume: Math.max(...volumes),
    dentroDoPadrao:
      volumeMedio >= config.limiar - TOLERANCIA_ML &&
      volumeMedio <= config.limiar + TOLERANCIA_ML,
  };
}
