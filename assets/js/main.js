
const configForm = document.getElementById("configForm");
const pesosForm = document.getElementById("pesosForm");
const resultadoDiv = document.getElementById("resultado");
const iniciarBtn = document.getElementById("iniciar");
const calcularBtn = document.getElementById("calcular");
const pesosInputsDiv = document.getElementById("pesosInputs");


let pesoLata, pesoTampa, densidade, limiar, quantidade;


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
    quantidade = parseInt(document.getElementById("quantidade").value);

    if (!pesoLata || !pesoTampa || !densidade || !limiar || !quantidade) {
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

    // Alternar telas
    configForm.classList.add("hidden");
    pesosForm.classList.remove("hidden");
});


calcularBtn.addEventListener("click", () => {
    const pesoCheioInputs = document.querySelectorAll(".pesoCheio");
    const pesosCheios = Array.from(pesoCheioInputs).map(input => parseFloat(input.value));

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
                    <p>Peso de cada lata: ${pesosCheios.join(" g, ")} g</p>
                    <p>Volumetria de cada lata: ${volumes.join(" ml, ")} mL</p>
                    <p>Volume médio: ${volumeMedio} mL</p>
                    <p>Menor volume: ${menorVolume} mL</p>
                    <p>Maior volume: ${maiorVolume} mL</p>`;
    mensagem += volumeMedio < limiar
        ? `<p style="color: red;">Volume médio abaixo do limiar (${limiar} mL).</p>`
        : `<p style="color: green;">Volume médio dentro do padrão.</p>`;

    // Exibir resultados
    pesosForm.classList.add("hidden");
    resultadoDiv.classList.remove("hidden");
    resultadoDiv.innerHTML = mensagem;
});
