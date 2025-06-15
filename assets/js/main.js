// Elementos DOM
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
const btnSalvar = document.getElementById("salvar");

let pesoLata, pesoTampa, densidade, limiar, quantidade;

// Função para limpar inputs e esconder telas
const limparCamposDinamicos = () => {
    pesosInputsDiv.innerHTML = "";
    resultadoDiv.innerHTML = "";
    pesosForm.classList.add("hidden");
    resultadoDiv.classList.add("hidden");
    btnSalvar.classList.add("hidden");
};

// Troca de telas com animação simples
const trocarTela = (ocultar, mostrar) => {
    ocultar.classList.add("fade-out");
    setTimeout(() => {
        ocultar.classList.add("hidden");
        ocultar.classList.remove("fade-out");
        mostrar.classList.remove("hidden");
        mostrar.classList.add("fade-in");
        setTimeout(() => mostrar.classList.remove("fade-in"), 500);
    }, 300);
};

// Eventos para escolher Unidade ou Pacote
btnUnidade.addEventListener("click", () => {
    limparCamposDinamicos();
    trocarTela(telaInicial, configForm);
    quantidadeLabel.classList.add("hidden");
    quantidadeSelect.classList.add("hidden");
});

btnPacote.addEventListener("click", () => {
    limparCamposDinamicos();
    trocarTela(telaInicial, configForm);
    quantidadeLabel.classList.remove("hidden");
    quantidadeSelect.classList.remove("hidden");
});

// Carregar config salva no localStorage
window.addEventListener("load", () => {
    const savedConfig = JSON.parse(localStorage.getItem("config"));
    if (savedConfig) {
        const { pesoLata, pesoTampa, densidade, limiar, quantidade } = savedConfig;
        document.getElementById("pesoLata").value = pesoLata;
        document.getElementById("pesoTampa").value = pesoTampa;
        document.getElementById("densidade").value = densidade;
        document.getElementById("limiar").value = limiar;
        document.getElementById("quantidade").value = quantidade;
    }
});

// Iniciar: valida e gera inputs para pesos cheios
iniciarBtn.addEventListener("click", () => {
    pesoLata = parseFloat(document.getElementById("pesoLata").value);
    pesoTampa = parseFloat(document.getElementById("pesoTampa").value);
    densidade = parseFloat(document.getElementById("densidade").value);
    limiar = parseFloat(document.getElementById("limiar").value);
    quantidade = quantidadeSelect.classList.contains("hidden") ? 1 : parseInt(quantidadeSelect.value);

    if ([pesoLata, pesoTampa, densidade, limiar].some(v => !v) || (quantidadeSelect.classList.contains("hidden") ? false : !quantidade)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    localStorage.setItem("config", JSON.stringify({ pesoLata, pesoTampa, densidade, limiar, quantidade }));

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

    trocarTela(configForm, pesosForm);
});

// Calcular volumes e mostrar resultados com animação
calcularBtn.addEventListener("click", () => {
    const pesosCheios = Array.from(document.querySelectorAll(".pesoCheio")).map(input => parseFloat(input.value));

    if (pesosCheios.some(isNaN)) {
        alert("Por favor, preencha todos os pesos das latas.");
        return;
    }

    const volumes = pesosCheios.map(pesoCheio => ((pesoCheio - (pesoLata + pesoTampa)) / densidade).toFixed(2));
    const volumeMedio = (volumes.reduce((acc, vol) => acc + parseFloat(vol), 0) / volumes.length).toFixed(2);
    const menorVolume = Math.min(...volumes).toFixed(2);
    const maiorVolume = Math.max(...volumes).toFixed(2);

    const dentroPadrao = volumeMedio >= (limiar - 2) && volumeMedio <= (limiar + 2);

    const mensagem = `
        <h2>Resultados</h2>
        <p><strong>Pesos das latas cheias:</strong> ${pesosCheios.join(", ")} g</p>
        <p><strong>Volumetria das latas:</strong> ${volumes.join(", ")} mL</p>
        <p><strong>Volume médio:</strong> ${volumeMedio} mL</p>
        <p><strong>Menor volume:</strong> ${menorVolume} mL</p>
        <p><strong>Maior volume:</strong> ${maiorVolume} mL</p>
        <p style="color: ${dentroPadrao ? "green" : "red"};">
            Volume médio ${dentroPadrao ? "dentro" : "fora"} do PADRÃO do limiar (${limiar} mL).
        </p>
        <h2>Configuração Inicial</h2>
        <p>Peso da lata vazia: ${pesoLata} g</p>
        <p>Peso da tampa: ${pesoTampa} g</p>
        <p>Densidade da cerveja: ${densidade} g/mL</p>
        <p>Limiar de enchimento: ${limiar} mL</p>
        <p>Quantidade no pacote: ${quantidade}</p>
    `;

    trocarTela(pesosForm, resultadoDiv);
    resultadoDiv.innerHTML = mensagem;
    //btnSalvar.classList.remove("hidden");
});

// Salvar dados no backend via fetch com async/await
btnSalvar.addEventListener("click", async () => {
    const pesosCheios = Array.from(document.querySelectorAll(".pesoCheio")).map(input => parseFloat(input.value));
    const volumes = pesosCheios.map(pesoCheio => ((pesoCheio - (pesoLata + pesoTampa)) / densidade).toFixed(2));
    const volumeMedio = (volumes.reduce((acc, vol) => acc + parseFloat(vol), 0) / volumes.length).toFixed(2);
    const menorVolume = Math.min(...volumes).toFixed(2);
    const maiorVolume = Math.max(...volumes).toFixed(2);

    const dados = {
        pesosCheios,
        volumes,
        volumeMedio,
        menorVolume,
        maiorVolume,
        pesoLata,
        pesoTampa,
        densidade,
        limiar,
        quantidade
    };

    try {
        const response = await fetch("http://localhost:3000/salvar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Dados salvos com sucesso!");
        } else {
            alert("Erro ao salvar os dados: " + (result.error || "Erro desconhecido"));
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
        console.error(error);
    }
});


