import { calcularResultados } from "./calculo.js";
import { carregarConfig, salvarConfig } from "./storage.js";
import {
  $, trocarTela, atualizarStepper, preencherConfig, lerQuantidadePacote,
  renderPesos, lerPesos, atualizarProgresso, renderResultado,
} from "./ui.js";

const telas = {
  telaInicial: { el: $("telaInicial"), passo: 0 },
  configForm: { el: $("configForm"), passo: 1 },
  pesosForm: { el: $("pesosForm"), passo: 2 },
  resultado: { el: $("resultado"), passo: 3 },
};

const campoQuantidade = $("campoQuantidade");
const pesosInputs = $("pesosInputs");

let config = null;
let telaAtual = "telaInicial";

function irPara(nome) {
  if (nome === telaAtual) return;
  trocarTela(telas[telaAtual].el, telas[nome].el);
  atualizarStepper(telas[nome].passo);
  telaAtual = nome;
}

function escolherModo(porPacote) {
  campoQuantidade.classList.toggle("hidden", !porPacote);
  irPara("configForm");
}

$("btnUnidade").addEventListener("click", () => escolherModo(false));
$("btnPacote").addEventListener("click", () => escolherModo(true));

// Navegação genérica (botões Voltar / Editar / Nova medição)
document.addEventListener("click", (e) => {
  const destino = e.target.closest("[data-ir]")?.dataset.ir;
  if (destino) irPara(destino);
});

// Restaura a última configuração usada
const salva = carregarConfig();
if (salva) preencherConfig(salva);

$("configForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const porPacote = !campoQuantidade.classList.contains("hidden");
  const quantidadePacote = lerQuantidadePacote();

  config = {
    pesoLata: $("pesoLata").valueAsNumber,
    pesoTampa: $("pesoTampa").valueAsNumber,
    densidade: $("densidade").valueAsNumber,
    limiar: $("limiar").valueAsNumber,
    quantidade: porPacote ? quantidadePacote : 1,
  };

  salvarConfig({ ...config, quantidade: quantidadePacote });
  renderPesos(pesosInputs, config.quantidade, () => atualizarProgresso(pesosInputs));
  irPara("pesosForm");
});

$("pesosForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const resultados = calcularResultados(lerPesos(pesosInputs), config);
  renderResultado(telas.resultado.el, resultados, config);
  irPara("resultado");
});
