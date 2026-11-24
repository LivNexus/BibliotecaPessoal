
// Gerenciamento da estante de livros

document.addEventListener("DOMContentLoaded", iniciarEstante);

function iniciarEstante() {

    const estante = document.getElementById("book-grid");
    const botoesFiltro = document.querySelectorAll(
        ".filters .filter[data-status]"
    );

    const campoPesquisa = document.getElementById("pesquisa-livro");
    const seletorOrdenacao = document.getElementById("ordenar-livros");

    // Verifica se os elementos necessários existem
    if (!estante) {
        console.error("Erro: elemento book-grid não encontrado.");
        return;
    }

    if (botoesFiltro.length === 0) {
        console.error("Erro: nenhum botão de filtro foi encontrado.");
        return;
    }

    let filtroAtual = "todos";
    let termoPesquisa = "";
    let criterioOrdenacao = "cadastro";

    // ------------------------------------------
    // 1. Normalização dos status
    // ------------------------------------------

    function normalizarStatus(status) {

        const valor = String(status ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ");

        const categorias = {
            "lido": "lidos",
            "lidos": "lidos",

            "abandonado": "abandonados",
            "abandonados": "abandonados",

            "pausado": "pausados",
            "pausados": "pausados",

            "quero ler": "quero ler",
            "lendo": "lendo",
            "relendo": "relendo"
        };

        return categorias[valor] || valor;
    }

    // ------------------------------------------
// Normalização dos textos da pesquisa
// ------------------------------------------

function normalizarTexto(texto) {

    return String(texto ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

}

    // ------------------------------------------
    // 2. Classes visuais dos status
    // ------------------------------------------

    function obterClasseStatus(status) {

        const classes = {
            "lendo": "reading",
            "lidos": "finished",
            "quero ler": "wishlist",
            "abandonados": "abandoned",
            "pausados": "paused",
            "relendo": "reading"
        };

        return classes[normalizarStatus(status)] || "";
    }

    // ------------------------------------------
    // 3. Criação dos cartões
    // ------------------------------------------

   function criarCardLivro(livro, indice) {

    const artigo = document.createElement("article");
    artigo.classList.add("book-card");

    // Capa
    const capa = document.createElement("div");
    capa.classList.add("book-cover");

    const estilosCapa = [
        "cover-one",
        "cover-two",
        "cover-three",
        "cover-four"
    ];

    capa.classList.add(
        estilosCapa[indice % estilosCapa.length]
    );

    const tituloCapa = document.createElement("span");
    tituloCapa.textContent = livro.titulo;

    const autorCapa = document.createElement("small");
    autorCapa.textContent = livro.autor || "Autor desconhecido";

    capa.appendChild(tituloCapa);
    capa.appendChild(autorCapa);

    // Informações
    const informacoes = document.createElement("div");
    informacoes.classList.add("book-info");

    const titulo = document.createElement("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.textContent = livro.autor || "Autor desconhecido";

    const status = document.createElement("span");
    status.classList.add("status");

    const classeStatus = obterClasseStatus(livro.status);

    if (classeStatus) {
        status.classList.add(classeStatus);
    }

    status.textContent = livro.status || "Sem status";

    informacoes.appendChild(titulo);
    informacoes.appendChild(autor);
    informacoes.appendChild(status);

    // Progresso de leitura
    const totalPaginas = Number(livro.paginas);
    const paginaAtual = Number(livro.paginaAtual) || 0;

    if (totalPaginas > 0) {

        const progresso = Math.min(
            Math.max((paginaAtual / totalPaginas) * 100, 0),
            100
        );

        const areaProgresso = document.createElement("div");
        areaProgresso.classList.add("reading-progress");

        const textoProgresso = document.createElement("p");
        textoProgresso.classList.add("progress-text");

        textoProgresso.textContent =
            `${paginaAtual} / ${totalPaginas} páginas`;

        const barraFundo = document.createElement("div");
        barraFundo.classList.add("progress-track");

        barraFundo.setAttribute("role", "progressbar");
        barraFundo.setAttribute("aria-valuenow", progresso.toFixed(1));
        barraFundo.setAttribute("aria-valuemin", "0");
        barraFundo.setAttribute("aria-valuemax", "100");
        barraFundo.setAttribute(
            "aria-label",
            `Progresso de leitura de ${livro.titulo}`
        );

        const barraPreenchida = document.createElement("div");
        barraPreenchida.classList.add("progress-fill");

        barraPreenchida.style.width = `${progresso}%`;

        const porcentagem = document.createElement("span");
        porcentagem.classList.add("progress-percentage");
        porcentagem.textContent = `${progresso.toFixed(1).replace(".", ",")}%`;

        barraFundo.appendChild(barraPreenchida);

        areaProgresso.appendChild(textoProgresso);
        areaProgresso.appendChild(barraFundo);
        areaProgresso.appendChild(porcentagem);

        informacoes.appendChild(areaProgresso);
    }

    // Botões de gerenciamento
    const acoes = document.createElement("div");
    acoes.classList.add("book-actions");

    // Botão editar
    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("edit-button");
    botaoEditar.type = "button";

    botaoEditar.addEventListener("click", () => {
        window.location.href = `adicionar.html?id=${livro.id}`;
    });

    // Botão excluir
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("delete-button");
    botaoExcluir.type = "button";

    botaoExcluir.addEventListener("click", () => {

        const confirmar = confirm(
            `Deseja realmente excluir "${livro.titulo}"?`
        );

        if (confirmar) {
            excluirLivro(livro.id);
            exibirLivros();
        }

    });

    acoes.appendChild(botaoEditar);
    acoes.appendChild(botaoExcluir);

    artigo.appendChild(capa);
    artigo.appendChild(informacoes);
    artigo.appendChild(acoes);

    return artigo;
}
    // ------------------------------------------
    // 4. Recuperação e exibição dos livros
    // ------------------------------------------

    function exibirLivros() {

        estante.innerHTML = "";

        let livros;

        try {

            livros = obterLivros();

            if (!Array.isArray(livros)) {
                throw new Error("Os dados recuperados não são uma lista.");
            }

        } catch (erro) {

            console.error("Erro ao recuperar livros:", erro);

            exibirMensagem(
                "Não foi possível carregar sua biblioteca."
            );

            return;
        }

        // Remove registros inválidos
        const livrosValidos = livros.filter(livro =>
            livro &&
            typeof livro === "object" &&
            typeof livro.titulo === "string" &&
            livro.titulo.trim() !== ""
        );

        // ------------------------------------------
// Aplicação dos filtros e da pesquisa
// ------------------------------------------

let livrosFiltrados = livrosValidos.filter(livro => {

    // Verifica o status
    const correspondeStatus =
        filtroAtual === "todos" ||
        normalizarStatus(livro.status) === filtroAtual;

    // Prepara os textos para pesquisa
    const titulo = normalizarTexto(livro.titulo);
    const autor = normalizarTexto(livro.autor);
    const pesquisa = normalizarTexto(termoPesquisa);

    // Pesquisa pelo título ou autor
    const correspondePesquisa =
        titulo.includes(pesquisa) ||
        autor.includes(pesquisa);

    return correspondeStatus && correspondePesquisa;

});

// ------------------------------------------
// Ordenação dos livros
// ------------------------------------------

livrosFiltrados = [...livrosFiltrados];

if (criterioOrdenacao === "titulo") {

    livrosFiltrados.sort((a, b) =>
        String(a.titulo || "").localeCompare(
            String(b.titulo || ""),
            "pt-BR",
            { sensitivity: "base" }
        )
    );

} else if (criterioOrdenacao === "autor") {

    livrosFiltrados.sort((a, b) =>
        String(a.autor || "").localeCompare(
            String(b.autor || ""),
            "pt-BR",
            { sensitivity: "base" }
        )
    );

} else if (criterioOrdenacao === "avaliacao") {

    livrosFiltrados.sort((a, b) =>
        (Number(b.avaliacao) || 0) -
        (Number(a.avaliacao) || 0)
    );

}

        // Verifica se existem livros
        if (livrosFiltrados.length === 0) {

            const mensagem = livrosValidos.length === 0
                ? "Sua estante está vazia. Que tal adicionar seu primeiro livro?"
                : "Nenhum livro encontrado nesta categoria.";

            exibirMensagem(mensagem);

            return;
        }

        // Cria os cartões
        livrosFiltrados.forEach((livro, indice) => {

            const card = criarCardLivro(livro, indice);

            estante.appendChild(card);

        });

    }

    // ------------------------------------------
    // 5. Mensagens da estante
    // ------------------------------------------

    function exibirMensagem(texto) {

        const mensagem = document.createElement("p");

        mensagem.classList.add("empty-message");
        mensagem.textContent = texto;

        estante.appendChild(mensagem);

    }

    // ------------------------------------------
    // 6. Configuração dos filtros
    // ------------------------------------------

    function configurarFiltros() {

        botoesFiltro.forEach(botao => {

            botao.addEventListener("click", () => {

                const statusSelecionado = botao.dataset.status;

                if (!statusSelecionado) {
                    console.warn("Botão sem data-status:", botao);
                    return;
                }

                filtroAtual = normalizarStatus(statusSelecionado);

                // Atualiza o botão ativo
                botoesFiltro.forEach(item => {

                    item.classList.remove("active-filter");
                    item.setAttribute("aria-pressed", "false");

                });

                botao.classList.add("active-filter");
                botao.setAttribute("aria-pressed", "true");

                // Atualiza a estante
                exibirLivros();

            });

        });

    }

// ------------------------------------------
// 7. Configuração da pesquisa e ordenação
// ------------------------------------------

function configurarPesquisaEOrdenacao() {

    // Pesquisa por título ou autor
    if (campoPesquisa) {

        campoPesquisa.addEventListener("input", () => {

            termoPesquisa = campoPesquisa.value;

            exibirLivros();

        });

    } else {

        console.error("Campo de pesquisa não encontrado!");

    }

    // Ordenação dos livros
    if (seletorOrdenacao) {

        seletorOrdenacao.addEventListener("change", () => {

            criterioOrdenacao = seletorOrdenacao.value;

            exibirLivros();

        });

    } else {

        console.error("Seletor de ordenação não encontrado!");

    }

}

    // ------------------------------------------
    // 7. Inicialização
    // ------------------------------------------

    configurarFiltros();
configurarPesquisaEOrdenacao();
exibirLivros();

console.log("Estante da Bibliotheca Athenae carregada!");
}