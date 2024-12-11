const selectEstados = document.querySelector("#estados");
const sessaoPrincipal = document.querySelector("#sessaoMain");
let listouMunicipios = false;
let estadoSelecionado,estadoComparado;

//Funções de reaproveitamento
function colocarInformacoes(informacaoUsada,dados) {
    informacaoUsada.innerHTML = `Estado: ${dados.nome}<br>
                                Região: ${dados.regiao.nome}<br>
                                Sigla: ${dados.sigla}
    `;  
}
function colocarTabela(tabelas,dadosTabela) {
    const infoCabecalho = ["Municipio","Código IBGE"];

    for(let i = 0;i<infoCabecalho.length;i++) {
        let cabecalho = document.createElement("th");
        cabecalho.textContent = infoCabecalho[i];
        tabelas.appendChild(cabecalho);
    }

    dadosTabela.forEach(municipio => {
        let linha,nome,codigo;
        linha = document.createElement("tr");
        nome = document.createElement("td");
        codigo = document.createElement("td");

        nome.textContent = municipio.nome;
        codigo.textContent = municipio.codigo_ibge;

        linha.appendChild(nome);
        linha.appendChild(codigo);
        tabelas.appendChild(linha);
    });
}
function limparDados(tabelas,infos) {
    if (tabelas) {
        tabelas.innerHTML = "";
        
    }
    if (infos) {
        infos.innerHTML = "";

    }
}

//Funções ASYNC
async function buscarInformacoes() {
    try {
        let info,url_2; 
        url_2 = `https://brasilapi.com.br/api/ibge/uf/v1/${selectEstados.value}`;

        info = await fetch(url_2);
        info = await info.json();

        informacoesEstado(info);
        console.log(info);
    }catch(error) {
        alert("Erro na busca!");
    }

}

async function buscarMunicipios() {
    try {
        let municipios,url;
        url = `https://brasilapi.com.br/api/ibge/municipios/v1/${selectEstados.value}`;
        
        municipios = await fetch(url);
        municipios = await municipios.json();
        
        tabelaMunicipio(municipios);
        console.log(municipios);
    }catch(error) {
        alert("Erro na busca!");
    }
}

function informacoesEstado(informacao) {
    let informacoes = document.querySelector("#informacoes");

    if (!informacoes) {
        informacoes = document.createElement("div");
        informacoes.id = "informacoes"

        colocarInformacoes(informacoes,informacao);
        sessaoPrincipal.appendChild(informacoes);
    }else {
        informacoes.innerHTML = "";
        colocarInformacoes(informacoes,informacao); 
    }

}

function tabelaMunicipio(listaMunicipio) {
    let tabela,button,abrirLista;
    abrirLista = true;
    tabela = document.querySelector("table");

    if (!tabela) {
        tabela = document.createElement("table");

        button = document.createElement("button");
        button.textContent = "Fechar lista de municipios";
        button.setAttribute("class","btn btn-secondary");


        button.addEventListener("click",() => {
            abrirLista = !abrirLista;
            if (!abrirLista) {
                button.textContent = "Abrir lista de municipios";
                tabela.style.display = "none";
            }else {
                button.textContent = "Fechar lista de municipios";
                tabela.style.display = "block";
            }

        })

        colocarTabela(tabela,listaMunicipio);
        sessaoPrincipal.appendChild(button);
        sessaoPrincipal.appendChild(tabela);
    }else {
        tabela.innerHTML = "";
        colocarTabela(tabela,listaMunicipio);
    }
}

async function pegarDDD(dddSelecionado) {
    try {
        let ddd,url_3;
        url_3 = `https://brasilapi.com.br/api/ddd/v1/${dddSelecionado}`;

        ddd = await fetch(url_3);
        ddd = await ddd.json();

        estadoComparado = ddd.state;
    }catch(error) {
        alert("Erro!");
    }

}

function inputDDD() {
    let sessaoDDD = document.querySelector("#sessaoDDD");
    if (!sessaoDDD) {
        sessaoDDD = document.createElement("div");
        sessaoDDD.id = "sessaoDDD";
        const input = document.createElement("input");
        const btn = document.createElement("button");
        const label = document.createElement("label");
        const msg = document.createElement("p");
        
        msg.textContent = "Nenhum DDD inserido";
        msg.style.color = "gray";
        label.textContent = "Validação de DDD: ";
        
        input.setAttribute("type","text");
        btn.textContent = "Validar DDD";
        btn.setAttribute("class","btn btn-primary w-100");
        sessaoDDD.setAttribute("class","d-flex flex-column text-center gap-2")
    
    
        sessaoDDD.appendChild(label);
        sessaoDDD.appendChild(msg);
        sessaoDDD.appendChild(input);
        sessaoDDD.appendChild(btn);
        sessaoPrincipal.appendChild(sessaoDDD);
    
        btn.addEventListener("click", async () => {
            if (input.value.length != "") {
                await pegarDDD(input.value);
            }
            if (estadoSelecionado === estadoComparado && input.value.length > 1) {
                input.style.border = "2px solid green";
                msg.style.color = "green";

                msg.textContent = "DDD pertencente ao estado correto!";
            }else {
                input.style.border = "2px solid red";
                msg.style.color = "red";

                msg.textContent = "(ERRO!) DDD não pertencente a este estado!";
            }
            if (input.value.length < 2 && input.value.length != 0) {
                msg.style.color = "red";
                msg.textContent = "(ERRO!) DDD com valor inválido"

            }else if (input.value.length == 0) {
                msg.style.color = "gray";
                msg.textContent = "Nenhum DDD inserido";
                input.style.border = "1px solid black";
            }
        });
    }
}
selectEstados.addEventListener("input",async () => {
    if (selectEstados.value != "") {
        estadoSelecionado = selectEstados.value;
        await buscarInformacoes();
        buscarMunicipios();
        inputDDD();
    }else {
        let tabela,informacoes;
        tabela = document.querySelector("table");
        informacoes = document.querySelector("#informacoes");
        limparDados(tabela,informacoes);
    }
})