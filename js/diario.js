const CHAVE_DIARIO = "bibliothecaAthenae_diario";

document.addEventListener("DOMContentLoaded", iniciarDiario);

function iniciarDiario() {

    const formulario = document.getElementById("form-diario");
    const seletorLivro = document.getElementById("livro-diario");
    const campoTitulo = document.getElementById("titulo-anotacao");
    const campoData = document.getElementById("data-anotacao");
    const campoTexto = document.getElementById("texto-anotacao");

    const listaAnotacoes = document.getElementById("lista-anotacoes");

    const botaoAnterior = document.getElementById("anotacao-anterior");
    const botaoProximo = document.getElementById("proxima-anotacao");
    const botaoVerTudo = document.getElementById("alternar-visualizacao");

    let indiceAtual = 0;
    let mostrarTodas = false;

    // Recupera as anotações salvas
    function obterAnotacoes() {

        const dados = localStorage.getItem(CHAVE_DIARIO);

        if (!dados) {
            return [];
        }

        try {
            return JSON.parse(dados);
        } catch (erro) {
            console.error("Erro ao recuperar as anotações:", erro);
            return [];
        }
    }

    // Salva as anotações no localStorage
    function salvarAnotacoes(anotacoes) {

        localStorage.setItem(
            CHAVE_DIARIO,
            JSON.stringify(anotacoes)
        );

    }

    // Preenche o seletor com os livros cadastrados
    function carregarLivros() {

        const livros = obterLivros();

        seletorLivro.innerHTML =
            '<option value="">Selecione um livro</option>';

        livros.forEach(livro => {

            const opcao = document.createElement("option");

            opcao.value = livro.id;
            opcao.textContent = livro.titulo;

            seletorLivro.appendChild(opcao);

        });

    }

    // Define a data atual como padrão
    function definirDataAtual() {

        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        campoData.value = `${ano}-${mes}-${dia}`;

    }

    // Formata a data para o padrão brasileiro
    function formatarData(data) {

        const [ano, mes, dia] = data.split("-");

        return `${dia}/${mes}/${ano}`;

    }

    // Cria uma nova anotação
    function criarAnotacao(dados) {

        const anotacoes = obterAnotacoes();
        const livros = obterLivros();

        const livro = livros.find(item => item.id === dados.livroId);

        const novaAnotacao = {

            id: crypto.randomUUID(),

            livroId: dados.livroId,

            livroTitulo: livro
                ? livro.titulo
                : "Livro não encontrado",

            titulo: dados.titulo,

            data: dados.data,

            texto: dados.texto

        };

        anotacoes.push(novaAnotacao);

        salvarAnotacoes(anotacoes);

    }

    // Cria o cartão de uma anotação
    function criarCardAnotacao(anotacao) {

        const artigo = document.createElement("article");
        artigo.classList.add("diary-card");

        const titulo = document.createElement("h3");
        titulo.textContent = anotacao.titulo;

        const livro = document.createElement("p");
        livro.classList.add("diary-book");
        livro.textContent = `Livro: ${anotacao.livroTitulo}`;

        const data = document.createElement("small");
        data.classList.add("diary-date");
        data.textContent = formatarData(anotacao.data);

        const texto = document.createElement("p");
        texto.classList.add("diary-text");
        texto.textContent = anotacao.texto;

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.classList.add("btn", "btn-danger");
        botaoExcluir.textContent = "Excluir anotação";

        botaoExcluir.addEventListener("click", () => {
            excluirAnotacao(anotacao.id);
        });

        artigo.appendChild(titulo);
        artigo.appendChild(livro);
        artigo.appendChild(data);
        artigo.appendChild(texto);
        artigo.appendChild(botaoExcluir);

        return artigo;

    }

    // Exibe as anotações
    function exibirAnotacoes() {

        const anotacoes = obterAnotacoes();

        listaAnotacoes.innerHTML = "";

        if (anotacoes.length === 0) {

            const mensagem = document.createElement("p");

            mensagem.classList.add("empty-message");

            mensagem.textContent =
                "Você ainda não possui anotações. Comece registrando suas impressões sobre uma leitura!";

            listaAnotacoes.appendChild(mensagem);

            botaoAnterior.hidden = true;
            botaoProximo.hidden = true;
            botaoVerTudo.hidden = true;

            return;

        }

        // Organiza as anotações da mais recente para a mais antiga
        const anotacoesOrdenadas = [...anotacoes].sort((a, b) => {

            return b.data.localeCompare(a.data);

        });

        // Mantém o índice dentro dos limites disponíveis
        indiceAtual = Math.min(
            indiceAtual,
            anotacoesOrdenadas.length - 1
        );

        // Cria os cartões
        anotacoesOrdenadas.forEach(anotacao => {

            const card = criarCardAnotacao(anotacao);

            listaAnotacoes.appendChild(card);

        });

        // Atualiza os botões de navegação
        botaoAnterior.hidden =
            mostrarTodas || anotacoes.length <= 1;

        botaoProximo.hidden =
            mostrarTodas || anotacoes.length <= 1;

        botaoVerTudo.hidden = anotacoes.length <= 1;

        botaoVerTudo.textContent =
            mostrarTodas ? "Ver menos" : "Ver tudo";

        // Alterna entre carrossel e visualização completa
        listaAnotacoes.classList.toggle(
            "show-all",
            mostrarTodas
        );

        if (!mostrarTodas) {

            listaAnotacoes.style.transform =
                `translateX(-${indiceAtual * 100}%)`;

        } else {

            listaAnotacoes.style.transform = "none";

        }

    }

    // Exclui uma anotação
    function excluirAnotacao(id) {

        const anotacoes = obterAnotacoes();

        const novaLista = anotacoes.filter(anotacao => {

            return anotacao.id !== id;

        });

        salvarAnotacoes(novaLista);

        indiceAtual = 0;

        exibirAnotacoes();

    }

    // Evento de envio do formulário
    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        if (!seletorLivro.value) {

            alert("Selecione um livro para registrar sua anotação.");

            return;

        }

        const dados = {

            livroId: seletorLivro.value,

            titulo: campoTitulo.value.trim(),

            data: campoData.value,

            texto: campoTexto.value.trim()

        };

        if (!dados.titulo || !dados.texto || !dados.data) {

            alert("Preencha todos os campos.");

            return;

        }

        criarAnotacao(dados);

        formulario.reset();

        definirDataAtual();

        indiceAtual = 0;
        mostrarTodas = false;

        exibirAnotacoes();

        alert("Anotação salva com sucesso!");

    });

    // Navega para a anotação anterior
    botaoAnterior.addEventListener("click", () => {

        if (indiceAtual > 0) {

            indiceAtual--;

            exibirAnotacoes();

        }

    });

    // Navega para a próxima anotação
    botaoProximo.addEventListener("click", () => {

        const anotacoes = obterAnotacoes();

        if (indiceAtual < anotacoes.length - 1) {

            indiceAtual++;

            exibirAnotacoes();

        }

    });

    // Alterna entre carrossel e visualização completa
    botaoVerTudo.addEventListener("click", () => {

        mostrarTodas = !mostrarTodas;

        indiceAtual = 0;

        exibirAnotacoes();

    });

    // Inicialização da página
    carregarLivros();

    definirDataAtual();

    exibirAnotacoes();

    console.log("Diário Literário carregado!");

}