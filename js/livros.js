// Gerenciamento de livros

// Gera um identificador único para cada livro
function gerarId() {
    return crypto.randomUUID();
}


// Cadastra um novo livro
function cadastrarLivro(dadosLivro) {

    const livros = obterLivros();

    // Verifica se o título foi preenchido
    if (!dadosLivro.titulo || !dadosLivro.titulo.trim()) {
        throw new Error("O título do livro é obrigatório.");
    }

    // Cria o objeto com as informações do livro
    const novoLivro = {
        id: gerarId(),
        titulo: dadosLivro.titulo.trim(),
        autor: dadosLivro.autor || "",
        genero: dadosLivro.genero || "",
        paginas: Number(dadosLivro.paginas) || 0,
        paginaAtual: Number(dadosLivro.paginaAtual) || 0,
        status: dadosLivro.status || "Quero ler",
        avaliacao: Number(dadosLivro.avaliacao) || 0,
        resenha: dadosLivro.resenha || "",
        capa: dadosLivro.capa || "",
        anoPlanejado: dadosLivro.anoPlanejado || "",
        dataInicio: dadosLivro.dataInicio || "",
        dataConclusao: dadosLivro.dataConclusao || ""
    };

    // Adiciona o livro à lista
    livros.push(novoLivro);

    // Salva a lista atualizada
    salvarLivros(livros);

    return novoLivro;
}


// Busca um livro pelo seu identificador
function obterLivroPorId(id) {

    const livros = obterLivros();

    return livros.find(livro => livro.id === id);
}


// Edita as informações de um livro
function editarLivro(id, novosDados) {

    const livros = obterLivros();

    const indice = livros.findIndex(livro => livro.id === id);

    // Verifica se o livro existe
    if (indice === -1) {
        return false;
    }

    // Impede que o título fique vazio
    if (
        novosDados.titulo !== undefined &&
        !novosDados.titulo.trim()
    ) {
        throw new Error("O título do livro não pode ficar vazio.");
    }

    // Atualiza as informações sem perder os dados anteriores
    livros[indice] = {
        ...livros[indice],
        ...novosDados,
        id: id
    };

    // Salva as alterações
    salvarLivros(livros);

    return true;
}


// Exclui um livro
function excluirLivro(id) {

    const livros = obterLivros();

    const novaLista = livros.filter(livro => livro.id !== id);

    // Verifica se algum livro foi removido
    if (novaLista.length === livros.length) {
        return false;
    }

    salvarLivros(novaLista);

    return true;
}