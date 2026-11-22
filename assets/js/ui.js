// Manipulação do DOM: troca de telas e renderização.

const DURACAO_FADE = 300;

export const $ = (id) => document.getElementById(id);

export function trocarTela(ocultar, mostrar) {
  ocultar.classList.add("fade-out");
  setTimeout(() => {
    ocultar.classList.add("hidden");
    ocultar.classList.remove("fade-out");
    mostrar.classList.remove("hidden");
    mostrar.classList.add("fade-in");
    setTimeout(() => mostrar.classList.remove("fade-in"), 500);
  }, DURACAO_FADE);
}

export function preencherConfig(config) {
  for (const [campo, valor] of Object.entries(config)) {
    const el = $(campo);
    if (el) el.value = valor;
  }
}

export function renderPesos(container, quantidade) {
  container.replaceChildren();
  for (let i = 1; i <= quantidade; i++) {
    const label = document.createElement("label");
    label.htmlFor = `pesoCheio${i}`;
    label.textContent = `Peso da lata cheia ${i} (g):`;

    const input = document.createElement("input");
    input.type = "number";
    input.id = `pesoCheio${i}`;
    input.step = "0.01";
    input.required = true;
    input.className = "pesoCheio";
    input.inputMode = "decimal";

    container.append(label, input);
  }
}

export function lerPesos(container) {
  return Array.from(container.querySelectorAll(".pesoCheio"), (i) => i.valueAsNumber);
}

const fmt = (n) => n.toFixed(2);

export function renderResultado(container, r, config) {
  const classe = r.dentroDoPadrao ? "ok" : "erro";
  container.innerHTML = `
    <h2>Resultados</h2>
    <p><strong>Pesos das latas cheias:</strong> ${r.pesosCheios.join(", ")} g</p>
    <p><strong>Volumetria das latas:</strong> ${r.volumes.map(fmt).join(", ")} mL</p>
    <p><strong>Volume médio:</strong> ${fmt(r.volumeMedio)} mL</p>
    <p><strong>Menor volume:</strong> ${fmt(r.menorVolume)} mL</p>
    <p><strong>Maior volume:</strong> ${fmt(r.maiorVolume)} mL</p>
    <p class="${classe}">
      Volume médio ${r.dentroDoPadrao ? "dentro" : "fora"} do PADRÃO do limiar (${config.limiar} mL).
    </p>
    <h2>Configuração Inicial</h2>
    <p>Peso da lata vazia: ${config.pesoLata} g</p>
    <p>Peso da tampa: ${config.pesoTampa} g</p>
    <p>Densidade da cerveja: ${config.densidade} g/mL</p>
    <p>Limiar de enchimento: ${config.limiar} mL</p>
    <p>Quantidade no pacote: ${config.quantidade}</p>
    <button type="button" id="novaMedicao">Nova medição</button>
  `;
}
