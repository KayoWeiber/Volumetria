const configForm = document.getElementById("configForm");
const pesosForm = document.getElementById("pesosForm");
const resultadoDiv = document.getElementById("resultado");
const iniciarBtn = document.getElementById("iniciar");
const calcularBtn = document.getElementById("calcular");
const pesosInputsDiv = document.getElementById("pesosInputs");
const telaInicial = document.getElementById("telaInicial");
const btnUnidade = document.getElementById("btnUnidade");
const btnPacote = document.getElementById("btnPacote");
const quantidadeLabel = document.getElementById("quantidadeLabel");
const quantidadeSelect = document.getElementById("quantidade");

let pesoLata, pesoTampa, densidade, limiar, quantidade;

function limparCamposDinamicos() {
    pesosInputsDiv.innerHTML = "";
    resultadoDiv.innerHTML = "";
    pesosForm.classList.add("hidden");
    resultadoDiv.classList.add("hidden");
}

btnUnidade.addEventListener("click", () => {
    limparCamposDinamicos();
    telaInicial.classList.add("hidden");
    configForm.classList.remove("hidden");
    quantidadeLabel.classList.add("hidden");
    quantidadeSelect.classList.add("hidden");
});

btnPacote.addEventListener("click", () => {
    limparCamposDinamicos();
    telaInicial.classList.add("hidden");
    configForm.classList.remove("hidden");
    quantidadeLabel.classList.remove("hidden");
    quantidadeSelect.classList.remove("hidden");
});

window.addEventListener("load", () => {
    const savedConfig = JSON.parse(localStorage.getItem("config"));
    if (savedConfig) {
        document.getElementById("pesoLata").value = savedConfig.pesoLata;
        document.getElementById("pesoTampa").value = savedConfig.pesoTampa;
        document.getElementById("densidade").value = savedConfig.densidade;
        document.getElementById("limiar").value = savedConfig.limiar;
        document.getElementById("quantidade").value = savedConfig.quantidade;
    }
});

iniciarBtn.addEventListener("click", () => {
    pesoLata = parseFloat(document.getElementById("pesoLata").value);
    pesoTampa = parseFloat(document.getElementById("pesoTampa").value);
    densidade = parseFloat(document.getElementById("densidade").value);
    limiar = parseFloat(document.getElementById("limiar").value);

    if (quantidadeSelect.classList.contains("hidden")) {
        quantidade = 1;
    } else {
        quantidade = parseInt(document.getElementById("quantidade").value);
    }

    if (!pesoLata || !pesoTampa || !densidade || !limiar || (quantidadeSelect.classList.contains("hidden") ? false : !quantidade)) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    localStorage.setItem(
        "config",
        JSON.stringify({ pesoLata, pesoTampa, densidade, limiar, quantidade })
    );


    pesosInputsDiv.innerHTML = "";
    for (let i = 1; i <= quantidade; i++) {
        const label = document.createElement("label");
        label.textContent = `Peso da lata cheia ${i} (g):`;
        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.required = true;
        input.className = "pesoCheio";
        pesosInputsDiv.appendChild(label);
        pesosInputsDiv.appendChild(input);
    }

    configForm.classList.add("hidden");
    pesosForm.classList.remove("hidden");
});

calcularBtn.addEventListener("click", () => {
    const pesosCheios = Array.from(document.querySelectorAll(".pesoCheio")).map(input => parseFloat(input.value));

    if (pesosCheios.includes(NaN)) {
        alert("Por favor, preencha todos os pesos das latas.");
        return;
    }

    const volumes = pesosCheios.map(pesoCheio =>
        ((pesoCheio - (pesoLata + pesoTampa)) / densidade).toFixed(2)
    );

    const volumeMedio = (
        volumes.reduce((acc, vol) => acc + parseFloat(vol), 0) / volumes.length
    ).toFixed(2);
    const menorVolume = Math.min(...volumes).toFixed(2);
    const maiorVolume = Math.max(...volumes).toFixed(2);

    let mensagem = `<h2>Resultados</h2>
                    <p>Peso das latas cheias: ${pesosCheios.join(", ")} g</p>
                    <p>Volumetria das latas: ${volumes.join(", ")} mL</p>
                    <p>Volume médio: ${volumeMedio} mL</p>
                    <p></p>
                    <p>Menor volume: ${menorVolume} mL</p>
                    <p></p>
                    <p>Maior volume: ${maiorVolume} mL</p>`;

    mensagem += volumeMedio < limiar || volumeMedio > limiar+2
        ? `<p style="color: red;">Volume médio fora do PADRÃO do limiar (${limiar}mL).</p>`
        : `<p style="color: green;">Volume médio dentro do padrão.</p>`;
    // Adicionar a configuração inicial à mensagem
    mensagem += `<h2>Configuração Inicial</h2>
                 <p>Peso da lata vazia: ${pesoLata} g</p>
                 <p>Peso da tampa: ${pesoTampa} g</p>
                 <p>Densidade da cerveja: ${densidade} g/mL</p>
                 <p> Limiar de enchimento: ${limiar} mL</p>
                 <p>Quantidade no pacote: ${quantidade}</p>`;

    pesosForm.classList.add("hidden");
    resultadoDiv.classList.remove("hidden");
    resultadoDiv.innerHTML = mensagem;
});