document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("form-livro");

    // Verifica se existe um ID na URL
    const parametros = new URLSearchParams(window.location.search);
    const idLivro = parametros.get("id");

    // Verifica se estamos editando
    const modoEdicao = Boolean(idLivro);

    // ------------------------------------------
    // 1. Carregamento dos dados para edição
    // ------------------------------------------

    if (modoEdicao) {

        const livro = obterLivroPorId(idLivro);

        if (!livro) {
            alert("Livro não encontrado.");
            window.location.href = "estante.html";
            return;
        }

        // Preenche os campos do formulário
        document.getElementById("titulo").value = livro.titulo;
        document.getElementById("autor").value = livro.autor;
        document.getElementById("genero").value = livro.genero;
        document.getElementById("paginas").value = livro.paginas;
        document.getElementById("paginaAtual").value = livro.paginaAtual;
        document.getElementById("status").value = livro.status;
        document.getElementById("avaliacao").value = livro.avaliacao;
        document.getElementById("anoPlanejado").value = livro.anoPlanejado;
        document.getElementById("resenha").value = livro.resenha;

        // Altera o título da página
        const tituloPagina = document.querySelector(".main-content h2");

        if (tituloPagina) {
            tituloPagina.textContent = "Editar livro";
        }

    }

    // ------------------------------------------
    // 2. Envio do formulário
    // ------------------------------------------

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        const dadosLivro = {
            titulo: document.getElementById("titulo").value,
            autor: document.getElementById("autor").value,
            genero: document.getElementById("genero").value,
            paginas: document.getElementById("paginas").value,
            paginaAtual: document.getElementById("paginaAtual").value,
            status: document.getElementById("status").value,
            avaliacao: document.getElementById("avaliacao").value,
            anoPlanejado: document.getElementById("anoPlanejado").value,
            resenha: document.getElementById("resenha").value
        };

        // Validações
        if (!dadosLivro.titulo.trim()) {
            alert("Por favor, informe o título do livro.");
            return;
        }

        if (
            dadosLivro.paginas &&
            Number(dadosLivro.paginas) < 1
        ) {
            alert("O livro precisa ter pelo menos uma página.");
            return;
        }

        if (
            Number(dadosLivro.paginaAtual) < 0 ||
            (
                dadosLivro.paginas &&
                Number(dadosLivro.paginaAtual) > Number(dadosLivro.paginas)
            )
        ) {
            alert("A página atual não pode ser maior que o total de páginas.");
            return;
        }

        try {

            if (modoEdicao) {

                editarLivro(idLivro, dadosLivro);

                alert("Livro atualizado com sucesso!");

            } else {

                cadastrarLivro(dadosLivro);

                alert("Livro cadastrado com sucesso!");

            }

            window.location.href = "estante.html";

        } catch (erro) {

            console.error("Erro ao salvar livro:", erro);

            alert("Não foi possível salvar o livro. Tente novamente.");

        }

    });

});