import { calcularResultados } from "./calculo.js";
import { carregarConfig, salvarConfig } from "./storage.js";
import { $, trocarTela, preencherConfig, renderPesos, lerPesos, renderResultado } from "./ui.js";

const telaInicial = $("telaInicial");
const configForm = $("configForm");
const pesosForm = $("pesosForm");
const resultado = $("resultado");
const campoQuantidade = $("campoQuantidade");

let config = null;
let telaAtual = telaInicial;

function irPara(tela) {
  trocarTela(telaAtual, tela);
  telaAtual = tela;
}

function escolherModo(porPacote) {
  campoQuantidade.classList.toggle("hidden", !porPacote);
  irPara(configForm);
}

$("btnUnidade").addEventListener("click", () => escolherModo(false));
$("btnPacote").addEventListener("click", () => escolherModo(true));

// Restaura a última configuração usada
const salva = carregarConfig();
if (salva) preencherConfig(salva);

configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const porPacote = !campoQuantidade.classList.contains("hidden");

  config = {
    pesoLata: $("pesoLata").valueAsNumber,
    pesoTampa: $("pesoTampa").valueAsNumber,
    densidade: $("densidade").valueAsNumber,
    limiar: $("limiar").valueAsNumber,
    quantidade: porPacote ? parseInt($("quantidade").value, 10) : 1,
  };

  salvarConfig({ ...config, quantidade: parseInt($("quantidade").value, 10) });
  renderPesos($("pesosInputs"), config.quantidade);
  irPara(pesosForm);
});

pesosForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const resultados = calcularResultados(lerPesos($("pesosInputs")), config);
  renderResultado(resultado, resultados, config);
  irPara(resultado);
});

resultado.addEventListener("click", (e) => {
  if (e.target.id === "novaMedicao") irPara(telaInicial);
});
