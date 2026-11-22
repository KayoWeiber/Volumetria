// Regras de negócio: funções puras, sem acesso ao DOM.

export const TOLERANCIA_ML = 2;

const arredondar = (n) => Math.round(n * 100) / 100;

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
    dentroDoPadrao: Math.abs(volumeMedio - config.limiar) <= TOLERANCIA_ML,
  };
}
