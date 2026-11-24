// =========================================
// BIBLIOTHECA ATHENAE - LOGIN
// =========================================

// Credenciais demonstrativas
const USUARIO_DEMONSTRACAO = {
    email: "bibliotheca@athenae.com",
    senha: "athenae123"
};

// Chave utilizada para identificar a sessão
const CHAVE_SESSAO = "bibliothecaAthenae_usuario";

// Aguarda o carregamento da página
document.addEventListener("DOMContentLoaded", iniciarLogin);


function iniciarLogin() {

    const formulario = document.getElementById("login-form");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");
    const botaoMostrarSenha = document.getElementById("mostrar-senha");
    const checkboxLembrar = document.getElementById("lembrar-login");
    const mensagem = document.getElementById("mensagem-login");

    // Verifica se os elementos existem
    if (!formulario || !campoEmail || !campoSenha) {
        console.error("Elementos do formulário de login não encontrados.");
        return;
    }

    // =========================================
    // MOSTRAR OU OCULTAR SENHA
    // =========================================

    botaoMostrarSenha.addEventListener("click", function () {

        const senhaVisivel = campoSenha.type === "text";

        if (senhaVisivel) {
            campoSenha.type = "password";
            botaoMostrarSenha.textContent = "Mostrar";
            botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
            botaoMostrarSenha.setAttribute("aria-pressed", "false");

        } else {
            campoSenha.type = "text";
            botaoMostrarSenha.textContent = "Ocultar";
            botaoMostrarSenha.setAttribute("aria-label", "Ocultar senha");
            botaoMostrarSenha.setAttribute("aria-pressed", "true");
        }

    });


    // =========================================
    // EXIBIR MENSAGENS
    // =========================================

    function exibirMensagem(texto, tipo) {

        mensagem.textContent = texto;
        mensagem.className = "login-message " + tipo;

    }


    // =========================================
    // AUTENTICAÇÃO
    // =========================================

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const email = campoEmail.value.trim().toLowerCase();
        const senha = campoSenha.value;

        // Verifica campos vazios
        if (email === "" || senha === "") {

            exibirMensagem(
                "Preencha todos os campos para continuar.",
                "error"
            );

            return;
        }

        // Verifica se o e-mail possui formato válido
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {

            exibirMensagem(
                "Digite um endereço de e-mail válido.",
                "error"
            );

            return;
        }

        // Verifica as credenciais
        if (
            email !== USUARIO_DEMONSTRACAO.email ||
            senha !== USUARIO_DEMONSTRACAO.senha
        ) {

            exibirMensagem(
                "E-mail ou senha incorretos. Tente novamente.",
                "error"
            );

            campoSenha.value = "";
            campoSenha.focus();

            return;
        }

        // =========================================
        // CRIAÇÃO DA SESSÃO
        // =========================================

        const usuario = {
            email: email,
            autenticado: true
        };

        // Se o usuário marcou "Manter sessão",
        // utiliza localStorage.
        if (checkboxLembrar && checkboxLembrar.checked) {

            localStorage.setItem(
                CHAVE_SESSAO,
                JSON.stringify(usuario)
            );

            sessionStorage.removeItem(CHAVE_SESSAO);

        } else {

            // Caso contrário, mantém a sessão apenas
            // enquanto a aba do navegador estiver aberta.
            sessionStorage.setItem(
                CHAVE_SESSAO,
                JSON.stringify(usuario)
            );

            localStorage.removeItem(CHAVE_SESSAO);

        }

        exibirMensagem(
            "Login realizado com sucesso! Redirecionando...",
            "success"
        );

        // Redireciona para a página inicial
        setTimeout(function () {

            window.location.href = "../index.html";

        }, 1000);

    });


    console.log("Login da Bibliotheca Athenae carregado!");

}