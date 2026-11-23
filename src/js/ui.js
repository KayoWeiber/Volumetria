// Manipulação do DOM: troca de telas e renderização.

const DURACAO_FADE = 200;

export const $ = (id) => document.getElementById(id);

const stepper = $("stepper");

export function atualizarStepper(indice) {
  [...stepper.children].forEach((li, i) => {
    li.classList.toggle("feito", i < indice);
    li.classList.toggle("atual", i === indice);
    if (i === indice) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
}

export function trocarTela(ocultar, mostrar) {
  ocultar.classList.add("fade-out");
  setTimeout(() => {
    ocultar.classList.add("hidden");
    ocultar.classList.remove("fade-out");
    mostrar.classList.remove("hidden");
    mostrar.classList.add("fade-in");
    setTimeout(() => mostrar.classList.remove("fade-in"), 400);
    const foco = mostrar.querySelector("input:not([type=radio]), button");
    if (foco && mostrar.tagName === "FORM") foco.focus({ preventScroll: true });
  }, DURACAO_FADE);
}

export function preencherConfig(config) {
  for (const [campo, valor] of Object.entries(config)) {
    if (campo === "quantidade") {
      const radio = document.querySelector(`input[name="quantidade"][value="${valor}"]`);
      if (radio) radio.checked = true;
    } else {
      const el = $(campo);
      if (el) el.value = valor;
    }
  }
}

export function lerQuantidadePacote() {
  return parseInt(document.querySelector('input[name="quantidade"]:checked').value, 10);
}

export function renderPesos(container, quantidade, aoMudar) {
  container.replaceChildren();
  for (let i = 1; i <= quantidade; i++) {
    const wrap = document.createElement("label");
    wrap.className = "peso-item";

    const rotulo = document.createElement("span");
    rotulo.textContent = `Lata ${i}`;

    const caixa = document.createElement("div");
    caixa.className = "entrada";

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.min = "0.01";
    input.required = true;
    input.className = "pesoCheio";
    input.inputMode = "decimal";
    input.addEventListener("input", aoMudar);

    const unidade = document.createElement("em");
    unidade.textContent = "g";

    caixa.append(input, unidade);
    wrap.append(rotulo, caixa);
    container.append(wrap);
  }
  atualizarProgresso(container);
}

export function lerPesos(container) {
  return Array.from(container.querySelectorAll(".pesoCheio"), (i) => i.valueAsNumber);
}

export function atualizarProgresso(container) {
  const inputs = [...container.querySelectorAll(".pesoCheio")];
  const preenchidos = inputs.filter((i) => i.value !== "").length;
  $("progressoTexto").textContent = `${preenchidos} de ${inputs.length}`;
  $("progressoBarra").style.width = `${(preenchidos / inputs.length) * 100}%`;
}

const nf = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (n) => nf.format(n);

const ICONE_OK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>`;
const ICONE_ERRO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7v6m0 3.5v.01"/></svg>`;

function renderGrafico(r, limiar) {
  const todos = [...r.volumes, limiar];
  const folga = Math.max((Math.max(...todos) - Math.min(...todos)) * 0.15, 1);
  const min = Math.min(...todos) - folga;
  const max = Math.max(...todos) + folga;
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const barras = r.volumes
    .map((v, i) => `<div class="barra" style="height:${pct(v).toFixed(1)}%" title="Lata ${i + 1}: ${fmt(v)} mL"></div>`)
    .join("");
  const eixo = r.volumes.map((_, i) => `<span>${i + 1}</span>`).join("");

  return `
    <div class="grafico">
      <h2>Volume por lata</h2>
      <div class="barras" role="img" aria-label="Gráfico de volume por lata comparado ao limiar de ${limiar} mL">
        ${barras}
        <div class="linha-limiar" style="bottom:${pct(limiar).toFixed(1)}%"><span>Limiar ${limiar} mL</span></div>
      </div>
      <div class="eixo">${eixo}</div>
    </div>`;
}

export function renderResultado(container, r, config) {
  const ok = r.dentroDoPadrao;
  const chips = r.volumes
    .map((v, i) => `<span class="chip"><b>#${i + 1}</b>${fmt(v)} mL</span>`)
    .join("");

  container.innerHTML = `
    <div class="tela-header"><h1>Resultado</h1></div>

    <div class="status ${ok ? "ok" : "erro"}" role="status">
      ${ok ? ICONE_OK : ICONE_ERRO}
      <div>
        Volume médio ${ok ? "dentro" : "fora"} do padrão
        <small>Limiar de ${config.limiar} mL (±2 mL)</small>
      </div>
    </div>

    <div class="stats">
      <div class="stat destaque"><span>Média</span><strong>${fmt(r.volumeMedio)}</strong><small>mL</small></div>
      <div class="stat"><span>Menor</span><strong>${fmt(r.menorVolume)}</strong><small>mL</small></div>
      <div class="stat"><span>Maior</span><strong>${fmt(r.maiorVolume)}</strong><small>mL</small></div>
    </div>

    ${r.volumes.length > 1 ? renderGrafico(r, config.limiar) : ""}

    <div class="chips" aria-label="Volumes individuais">${chips}</div>

    <details class="config">
      <summary>Configuração utilizada</summary>
      <dl>
        <dt>Peso da lata vazia</dt><dd>${config.pesoLata} g</dd>
        <dt>Peso da tampa</dt><dd>${config.pesoTampa} g</dd>
        <dt>Densidade</dt><dd>${config.densidade} g/mL</dd>
        <dt>Limiar</dt><dd>${config.limiar} mL</dd>
        <dt>Quantidade</dt><dd>${config.quantidade}</dd>
      </dl>
    </details>

    <div class="acoes">
      <button type="button" class="btn btn-ghost" data-ir="pesosForm">Editar pesos</button>
      <button type="button" class="btn btn-primary" data-ir="telaInicial">Nova medição</button>
    </div>
  `;
}
