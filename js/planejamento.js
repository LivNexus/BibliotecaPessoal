document.addEventListener("DOMContentLoaded", iniciarPlanejamento);

function iniciarPlanejamento() {

    const seletorAno = document.getElementById("ano-selecionado");
    const areaLivros = document.getElementById("livros-planejados");

    const totalPlanejados = document.getElementById("total-planejados");
    const totalConcluidos = document.getElementById("total-concluidos");
    const totalAndamento = document.getElementById("total-andamento");

    if (!seletorAno || !areaLivros) {
        console.error("Elementos do planejamento não encontrados.");
        return;
    }

    // Recupera os livros cadastrados
    function carregarLivros() {

        const livros = obterLivros();

        if (!Array.isArray(livros)) {
            console.error("Não foi possível recuperar os livros.");
            return [];
        }

        return livros;
    }

    // Normaliza os status
    function normalizarStatus(status) {

        return String(status || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Filtra os livros pelo ano selecionado
    function obterLivrosDoAno() {

        const livros = carregarLivros();
        const ano = seletorAno.value;

        return livros.filter(livro =>
            String(livro.anoPlanejado) === ano
        );
    }

    // Atualiza os contadores
    function atualizarResumo(livros) {

        const concluidos = livros.filter(livro => {

            const status = normalizarStatus(livro.status);

            return status === "lido" || status === "lidos";

        }).length;

        const andamento = livros.filter(livro => {

            const status = normalizarStatus(livro.status);

            return status === "lendo" || status === "relendo";

        }).length;

        totalPlanejados.textContent = livros.length;
        totalConcluidos.textContent = concluidos;
        totalAndamento.textContent = andamento;
    }

    // Cria os cartões dos livros
    function criarCardPlanejamento(livro) {

        const artigo = document.createElement("article");
        artigo.classList.add("book-card");

        const capa = document.createElement("div");
        capa.classList.add("book-cover");

        const tituloCapa = document.createElement("span");
        tituloCapa.textContent = livro.titulo;

        const autorCapa = document.createElement("small");
        autorCapa.textContent = livro.autor || "Autor desconhecido";

        capa.appendChild(tituloCapa);
        capa.appendChild(autorCapa);

        const informacoes = document.createElement("div");
        informacoes.classList.add("book-info");

        const titulo = document.createElement("h3");
        titulo.textContent = livro.titulo;

        const autor = document.createElement("p");
        autor.textContent = livro.autor || "Autor desconhecido";

        const status = document.createElement("span");
        status.classList.add("status");
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

            const texto = document.createElement("p");
            texto.classList.add("progress-text");
            texto.textContent = `${paginaAtual} / ${totalPaginas} páginas`;

            const barra = document.createElement("div");
            barra.classList.add("progress-track");

            barra.setAttribute("role", "progressbar");
            barra.setAttribute("aria-valuenow", progresso.toFixed(1));
            barra.setAttribute("aria-valuemin", "0");
            barra.setAttribute("aria-valuemax", "100");

            const preenchimento = document.createElement("div");
            preenchimento.classList.add("progress-fill");
            preenchimento.style.width = `${progresso}%`;

            const porcentagem = document.createElement("span");
            porcentagem.classList.add("progress-percentage");
            porcentagem.textContent =
                `${progresso.toFixed(1).replace(".", ",")}%`;

            barra.appendChild(preenchimento);

            areaProgresso.appendChild(texto);
            areaProgresso.appendChild(barra);
            areaProgresso.appendChild(porcentagem);

            informacoes.appendChild(areaProgresso);
        }

        artigo.appendChild(capa);
        artigo.appendChild(informacoes);

        return artigo;
    }

    // Exibe os livros planejados
    function exibirPlanejamento() {

        const livros = obterLivrosDoAno();

        areaLivros.innerHTML = "";

        atualizarResumo(livros);

        if (livros.length === 0) {

            const mensagem = document.createElement("p");

            mensagem.classList.add("empty-message");
            mensagem.textContent =
                "Nenhum livro planejado para este ano. Que tal adicionar uma nova leitura?";

            areaLivros.appendChild(mensagem);

            return;
        }

        livros.forEach(livro => {

            const card = criarCardPlanejamento(livro);

            areaLivros.appendChild(card);

        });
    }

    // Atualiza a página quando o ano muda
    seletorAno.addEventListener("change", exibirPlanejamento);

    // Exibição inicial
    exibirPlanejamento();

    console.log("Planejamento de leitura carregado!");
}