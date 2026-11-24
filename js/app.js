// Arquivo principal

document.addEventListener("DOMContentLoaded", () => {

    console.log("Bibliotheca Athenae carregada!");

    let filtroAtual = "todos";

    // Elementos do carrossel
    const carrossel = document.getElementById("book-grid");
    const botaoAnterior = document.getElementById("carousel-prev");
    const botaoProximo = document.getElementById("carousel-next");


    // Normaliza os status para facilitar a comparação
    function normalizarStatus(status) {
        return status.trim().toLowerCase();
    }


    // Atualiza os números do resumo
    function atualizarResumo() {

        const livros = obterLivros();

        const total = livros.length;

        const lidos = livros.filter(livro =>
            ["lido", "lidos"].includes(normalizarStatus(livro.status))
        ).length;

        const lendo = livros.filter(livro =>
            normalizarStatus(livro.status) === "lendo"
        ).length;

        const queroLer = livros.filter(livro =>
            normalizarStatus(livro.status) === "quero ler"
        ).length;

        document.getElementById("total-livros").textContent = total;
        document.getElementById("total-lidos").textContent = lidos;
        document.getElementById("total-lendo").textContent = lendo;
        document.getElementById("total-quero-ler").textContent = queroLer;
    }


    // Define a classe visual correspondente ao status
    function obterClasseStatus(status) {

        const classes = {
            "lendo": "reading",
            "lido": "finished",
            "lidos": "finished",
            "quero ler": "wishlist",
            "abandonado": "abandoned",
            "abandonados": "abandoned",
            "pausado": "paused",
            "pausados": "paused",
            "relendo": "reading"
        };

        return classes[normalizarStatus(status)] || "";
    }


    // Cria o card de um livro
    function criarCardLivro(livro, indice) {

        const artigo = document.createElement("article");
        artigo.classList.add("book-card");

        // Capa do livro
        const capa = document.createElement("div");
        capa.classList.add("book-cover");

        const estilosCapa = [
            "cover-one",
            "cover-two",
            "cover-three",
            "cover-four"
        ];

        capa.classList.add(estilosCapa[indice % estilosCapa.length]);

        const tituloCapa = document.createElement("span");
        tituloCapa.textContent = livro.titulo;

        const autorCapa = document.createElement("small");
        autorCapa.textContent = livro.autor || "Autor desconhecido";

        capa.appendChild(tituloCapa);
        capa.appendChild(autorCapa);


        // Informações do livro
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

        status.textContent = livro.status;


        // Montagem do card
        informacoes.appendChild(titulo);
        informacoes.appendChild(autor);
        informacoes.appendChild(status);

        artigo.appendChild(capa);
        artigo.appendChild(informacoes);

        return artigo;
    }


    // Atualiza o estado das setas do carrossel
    function atualizarControlesCarrossel() {

        // Verifica se os elementos existem
        if (!carrossel || !botaoAnterior || !botaoProximo) {
            return;
        }

        const limite = carrossel.scrollWidth - carrossel.clientWidth;

        botaoAnterior.disabled = carrossel.scrollLeft <= 2;

        botaoProximo.disabled =
            limite <= 2 || carrossel.scrollLeft >= limite - 2;
    }


    // Configura a navegação do carrossel
    function configurarCarrossel() {

        if (!carrossel || !botaoAnterior || !botaoProximo) {
            return;
        }

        // Volta para os livros anteriores
        botaoAnterior.addEventListener("click", () => {

            carrossel.scrollBy({
                left: -carrossel.clientWidth * 0.8,
                behavior: "smooth"
            });

        });


        // Avança para os próximos livros
        botaoProximo.addEventListener("click", () => {

            carrossel.scrollBy({
                left: carrossel.clientWidth * 0.8,
                behavior: "smooth"
            });

        });


        // Atualiza as setas durante a navegação
        carrossel.addEventListener("scroll", () => {
            atualizarControlesCarrossel();
        });


        // Atualiza as setas quando a janela muda de tamanho
        window.addEventListener("resize", () => {
            atualizarControlesCarrossel();
        });

    }


    // Exibe os livros na estante
    function exibirLivros() {

        const livros = obterLivros();

        carrossel.innerHTML = "";

        // Aplica o filtro selecionado
        const livrosFiltrados = livros.filter(livro => {

            if (filtroAtual === "todos") {
                return true;
            }

            return normalizarStatus(livro.status) ===
                normalizarStatus(filtroAtual);
        });


        // Mensagem quando não existem livros
        if (livrosFiltrados.length === 0) {

            const mensagem = document.createElement("p");

            mensagem.classList.add("empty-message");

            mensagem.textContent = livros.length === 0
                ? "Sua estante está vazia. Que tal adicionar seu primeiro livro?"
                : "Nenhum livro encontrado nesta categoria.";

            carrossel.appendChild(mensagem);

            atualizarControlesCarrossel();

            return;
        }


        // Cria os cards dinamicamente
        livrosFiltrados.forEach((livro, indice) => {

            const card = criarCardLivro(livro, indice);

            carrossel.appendChild(card);

        });

        // Retorna ao início quando o filtro muda
        carrossel.scrollLeft = 0;

        // Atualiza o estado das setas após renderizar
        requestAnimationFrame(() => {
            atualizarControlesCarrossel();
        });

    }


    // Configura os filtros da estante
    function configurarFiltros() {

        const botoes = document.querySelectorAll(".filter");

        botoes.forEach(botao => {

            botao.addEventListener("click", () => {

                filtroAtual = botao.dataset.status;

                // Atualiza o botão selecionado
                botoes.forEach(item => {
                    item.classList.remove("active-filter");
                });

                botao.classList.add("active-filter");

                exibirLivros();

            });

        });

    }


    // Inicializa a página
    function iniciarBiblioteca() {

        atualizarResumo();

        configurarCarrossel();

        exibirLivros();

        configurarFiltros();

    }


    iniciarBiblioteca();

});