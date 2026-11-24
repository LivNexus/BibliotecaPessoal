const CHAVE_ACESSIBILIDADE = "bibliothecaAthenae_acessibilidade";

document.addEventListener("DOMContentLoaded", iniciarAcessibilidade);

function iniciarAcessibilidade() {

    const botaoPainel = document.getElementById("botao-acessibilidade");
    const painel = document.getElementById("painel-acessibilidade");

    const botaoClaro = document.getElementById("modo-claro");
    const botaoEscuro = document.getElementById("modo-escuro");

    const botaoAumentar = document.getElementById("aumentar-fonte");
    const botaoDiminuir = document.getElementById("diminuir-fonte");

    const botaoContraste = document.getElementById("alto-contraste");
    const botaoRestaurar = document.getElementById("restaurar-acessibilidade");

    const elementoRaiz = document.documentElement;

    let configuracoes = {
        tema: "claro",
        tamanhoFonte: 16,
        altoContraste: false
    };

    // Recupera as preferências salvas
    function carregarConfiguracoes() {

        const dados = localStorage.getItem(CHAVE_ACESSIBILIDADE);

        if (dados) {
            try {
                const salvas = JSON.parse(dados);

                if (
                    salvas &&
                    ["claro", "escuro"].includes(salvas.tema) &&
                    Number.isFinite(salvas.tamanhoFonte) &&
                    salvas.tamanhoFonte >= 14 &&
                    salvas.tamanhoFonte <= 22 &&
                    typeof salvas.altoContraste === "boolean"
                ) {
                    configuracoes = salvas;
                }

            } catch (erro) {
                console.error("Erro ao recuperar as configurações:", erro);
            }
        }

        aplicarConfiguracoes();
    }

    // Salva as preferências
    function salvarConfiguracoes() {

        localStorage.setItem(
            CHAVE_ACESSIBILIDADE,
            JSON.stringify(configuracoes)
        );

    }

    // Aplica as preferências na página
    function aplicarConfiguracoes() {

        document.body.classList.toggle(
            "dark-theme",
            configuracoes.tema === "escuro"
        );

        document.body.classList.toggle(
            "high-contrast",
            configuracoes.altoContraste
        );

        elementoRaiz.style.fontSize =
            `${configuracoes.tamanhoFonte}px`;

        botaoContraste.setAttribute(
            "aria-pressed",
            String(configuracoes.altoContraste)
        );

        botaoClaro.setAttribute(
            "aria-pressed",
            String(configuracoes.tema === "claro")
        );

        botaoEscuro.setAttribute(
            "aria-pressed",
            String(configuracoes.tema === "escuro")
        );

    }

    // Abre e fecha o painel
    botaoPainel.addEventListener("click", () => {

        const estaFechado = painel.hidden;

        painel.hidden = !estaFechado;

        botaoPainel.setAttribute(
            "aria-expanded",
            String(estaFechado)
        );

    });

    // Fecha o painel ao clicar fora dele
    document.addEventListener("click", (evento) => {

        if (
            !painel.hidden &&
            !painel.contains(evento.target) &&
            !botaoPainel.contains(evento.target)
        ) {

            painel.hidden = true;
            botaoPainel.setAttribute("aria-expanded", "false");

        }

    });

    // Fecha o painel com a tecla Escape
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape" && !painel.hidden) {

            painel.hidden = true;
            botaoPainel.setAttribute("aria-expanded", "false");
            botaoPainel.focus();

        }

    });

    // Ativa o modo claro
    botaoClaro.addEventListener("click", () => {

        configuracoes.tema = "claro";

        aplicarConfiguracoes();
        salvarConfiguracoes();

    });

    // Ativa o modo escuro
    botaoEscuro.addEventListener("click", () => {

        configuracoes.tema = "escuro";

        aplicarConfiguracoes();
        salvarConfiguracoes();

    });

    // Aumenta a fonte até o limite de 22px
    botaoAumentar.addEventListener("click", () => {

        if (configuracoes.tamanhoFonte < 22) {

            configuracoes.tamanhoFonte += 2;

            aplicarConfiguracoes();
            salvarConfiguracoes();

        }

    });

    // Diminui a fonte até o limite de 14px
    botaoDiminuir.addEventListener("click", () => {

        if (configuracoes.tamanhoFonte > 14) {

            configuracoes.tamanhoFonte -= 2;

            aplicarConfiguracoes();
            salvarConfiguracoes();

        }

    });

    // Ativa ou desativa o alto contraste
    botaoContraste.addEventListener("click", () => {

        configuracoes.altoContraste = !configuracoes.altoContraste;

        aplicarConfiguracoes();
        salvarConfiguracoes();

    });

    // Restaura as configurações originais
    botaoRestaurar.addEventListener("click", () => {

        configuracoes = {
            tema: "claro",
            tamanhoFonte: 16,
            altoContraste: false
        };

        aplicarConfiguracoes();
        salvarConfiguracoes();

    });

    carregarConfiguracoes();

    console.log("Acessibilidade carregada!");

}