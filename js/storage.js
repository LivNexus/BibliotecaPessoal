// Sistema de armazenamento de livros
const CHAVE_LIVROS = "bibliothecaAthenae_livros";


// Recupera os livros armazenados
function obterLivros() {
    const dados = localStorage.getItem(CHAVE_LIVROS);

    // Se não houver livros salvos, retorna uma lista vazia.
    if (!dados) {
        return [];
    }

    // Converte os dados armazenados para JavaScript.
    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao recuperar os livros:", erro);
        return [];
    }
}


// Salva a lista de livros no navegador
function salvarLivros(livros) {
    localStorage.setItem(CHAVE_LIVROS, JSON.stringify(livros));
}