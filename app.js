/* =====================================================
   MEUS TREINOS - APP.JS
===================================================== */

import {

    auth,
    db,

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot

} from "./firebase.js";



/* =====================================================
   ESTADO GLOBAL
===================================================== */

const state = {

    usuario: null,

    treinos: [],

    treinoSelecionadoId: null,

    carregandoTreinos: true,

    unsubscribeTreinos: null,

    toastTimer: null

};



/* =====================================================
   ELEMENTOS - LOGIN
===================================================== */

const telaLogin =
    document.getElementById("telaLogin");

const aplicativo =
    document.getElementById("aplicativo");

const formLogin =
    document.getElementById("formLogin");

const emailLogin =
    document.getElementById("emailLogin");

const senhaLogin =
    document.getElementById("senhaLogin");

const mensagemLogin =
    document.getElementById("mensagemLogin");

const btnCriarConta =
    document.getElementById("btnCriarConta");

const btnSair =
    document.getElementById("btnSair");



/* =====================================================
   ELEMENTOS - PÁGINAS
===================================================== */

const paginaInicio =
    document.getElementById("paginaInicio");

const paginaTreinos =
    document.getElementById("paginaTreinos");

const paginaDetalheTreino =
    document.getElementById("paginaDetalheTreino");

const paginaProgresso =
    document.getElementById("paginaProgresso");

const paginaHistorico =
    document.getElementById("paginaHistorico");

const botoesNavegacao =
    document.querySelectorAll(".nav-item");



/* =====================================================
   ELEMENTOS - DASHBOARD
===================================================== */

const resumoTreinos =
    document.getElementById("resumoTreinos");

const resumoExercicios =
    document.getElementById("resumoExercicios");

const listaTreinosInicio =
    document.getElementById("listaTreinosInicio");

const listaTreinos =
    document.getElementById("listaTreinos");



/* =====================================================
   ELEMENTOS - TREINO
===================================================== */

const btnNovoTreinoInicio =
    document.getElementById("btnNovoTreinoInicio");

const btnNovoTreino =
    document.getElementById("btnNovoTreino");

const btnVoltarTreinos =
    document.getElementById("btnVoltarTreinos");

const detalheTreinoCodigo =
    document.getElementById("detalheTreinoCodigo");

const detalheTreinoNome =
    document.getElementById("detalheTreinoNome");

const detalheTreinoFoco =
    document.getElementById("detalheTreinoFoco");

const btnEditarTreino =
    document.getElementById("btnEditarTreino");

const btnIniciarTreino =
    document.getElementById("btnIniciarTreino");

const btnAdicionarExercicioDetalhe =
    document.getElementById(
        "btnAdicionarExercicioDetalhe"
    );

const listaExerciciosDetalhe =
    document.getElementById(
        "listaExerciciosDetalhe"
    );



/* =====================================================
   MODAL TREINO
===================================================== */

const modalTreino =
    document.getElementById("modalTreino");

const tituloModalTreino =
    document.getElementById("tituloModalTreino");

const formTreino =
    document.getElementById("formTreino");

const treinoIdInput =
    document.getElementById("treinoId");

const nomeTreinoInput =
    document.getElementById("nomeTreino");

const focoTreinoInput =
    document.getElementById("focoTreino");

const btnExcluirTreino =
    document.getElementById("btnExcluirTreino");



/* =====================================================
   MODAL EXERCÍCIO
===================================================== */

const modalExercicio =
    document.getElementById("modalExercicio");

const tituloModalExercicio =
    document.getElementById(
        "tituloModalExercicio"
    );

const formExercicio =
    document.getElementById("formExercicio");

const exercicioIdInput =
    document.getElementById("exercicioId");

const nomeExercicioInput =
    document.getElementById("nomeExercicio");

const seriesExercicioInput =
    document.getElementById("seriesExercicio");

const repsMinExercicioInput =
    document.getElementById("repsMinExercicio");

const repsMaxExercicioInput =
    document.getElementById("repsMaxExercicio");

const cargaExercicioInput =
    document.getElementById("cargaExercicio");

const incrementoExercicioInput =
    document.getElementById(
        "incrementoExercicio"
    );

const descansoExercicioInput =
    document.getElementById(
        "descansoExercicio"
    );

const observacaoExercicioInput =
    document.getElementById(
        "observacaoExercicio"
    );

const btnExcluirExercicio =
    document.getElementById(
        "btnExcluirExercicio"
    );



/* =====================================================
   TOAST
===================================================== */

const toast =
    document.getElementById("toast");



/* =====================================================
   UTILIDADES
===================================================== */

function gerarId() {

    if (
        window.crypto
        &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }

    return (
        Date.now().toString()
        +
        Math.random()
            .toString(16)
            .slice(2)
    );

}



function numero(valor, padrao = 0) {

    const convertido =
        Number(valor);

    return Number.isFinite(convertido)
        ? convertido
        : padrao;

}



function escaparHTML(valor = "") {

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



function formatarCarga(valor) {

    const carga =
        numero(valor);

    return carga.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits:
                Number.isInteger(carga)
                    ? 0
                    : 1,

            maximumFractionDigits: 2
        }
    );

}



function mostrarToast(
    mensagem,
    tipo = "sucesso"
) {

    if (state.toastTimer) {

        clearTimeout(
            state.toastTimer
        );

    }

    toast.textContent =
        mensagem;

    toast.className =
        `toast ${tipo}`;

    toast.hidden =
        false;


    state.toastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },

            2500
        );

}



function encontrarTreino(id) {

    return state.treinos.find(
        treino =>
            treino.id === id
    );

}



function treinoSelecionado() {

    if (
        !state.treinoSelecionadoId
    ) {

        return null;

    }

    return encontrarTreino(
        state.treinoSelecionadoId
    );

}



/* =====================================================
   COMPATIBILIDADE COM DADOS ANTIGOS
===================================================== */

function interpretarRepeticoes(
    exercicio
) {

    let repsMin =
        numero(
            exercicio.repsMin,
            0
        );

    let repsMax =
        numero(
            exercicio.repsMax,
            0
        );


    if (
        repsMin > 0
        &&
        repsMax > 0
    ) {

        return {
            repsMin,
            repsMax
        };

    }


    const repsAntigas =
        String(
            exercicio.reps ?? ""
        )
        .trim();


    if (
        repsAntigas.includes("-")
    ) {

        const partes =
            repsAntigas
                .split("-");


        repsMin =
            numero(
                partes[0],
                8
            );

        repsMax =
            numero(
                partes[1],
                repsMin
            );

    }

    else if (
        repsAntigas
    ) {

        const valor =
            numero(
                repsAntigas,
                10
            );

        repsMin =
            valor;

        repsMax =
            valor;

    }

    else {

        repsMin =
            8;

        repsMax =
            12;

    }


    return {
        repsMin,
        repsMax
    };

}



function normalizarExercicio(
    exercicio = {},
    indice = 0
) {

    const reps =
        interpretarRepeticoes(
            exercicio
        );


    return {

        id:
            exercicio.id
            ||
            gerarId(),

        nome:
            String(
                exercicio.nome
                ||
                "Exercício"
            ),

        series:
            Math.max(
                1,
                numero(
                    exercicio.series,
                    3
                )
            ),

        repsMin:
            Math.max(
                1,
                reps.repsMin
            ),

        repsMax:
            Math.max(
                1,
                reps.repsMax
            ),

        carga:
            Math.max(
                0,
                numero(
                    exercicio.carga,
                    0
                )
            ),

        incremento:
            Math.max(
                0.5,
                numero(
                    exercicio.incremento,
                    2.5
                )
            ),

        descanso:
            Math.max(
                0,
                numero(
                    exercicio.descanso,
                    90
                )
            ),

        observacao:
            String(
                exercicio.observacao
                ||
                ""
            ),

        ordem:
            numero(
                exercicio.ordem,
                indice
            )

    };

}



function normalizarTreino(
    documento
) {

    const data =
        documento.data();


    const exercicios =
        Array.isArray(
            data.exercicios
        )
        ?
        data.exercicios
            .map(
                normalizarExercicio
            )
            .sort(
                (a, b) =>
                    a.ordem
                    -
                    b.ordem
            )
        :
        [];


    return {

        id:
            documento.id,

        nome:
            String(
                data.nome
                ||
                "Treino"
            ),

        foco:
            String(
                data.foco
                ||
                ""
            ),

        exercicios,

        criadoEm:
            numero(
                data.criadoEm,
                0
            ),

        atualizadoEm:
            numero(
                data.atualizadoEm,
                0
            )

    };

}



/* =====================================================
   AUTENTICAÇÃO
===================================================== */

formLogin.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        mensagemLogin.textContent =
            "";


        const email =
            emailLogin
                .value
                .trim();

        const senha =
            senhaLogin
                .value;


        if (
            !email
            ||
            !senha
        ) {

            mensagemLogin.textContent =
                "Preencha e-mail e senha.";

            return;

        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

        }

        catch (erro) {

            console.error(
                "Erro de login:",
                erro
            );


            mensagemLogin.textContent =
                "E-mail ou senha incorretos.";

        }

    }
);



btnCriarConta.addEventListener(
    "click",
    async () => {

        mensagemLogin.textContent =
            "";


        const email =
            emailLogin
                .value
                .trim();

        const senha =
            senhaLogin
                .value;


        if (!email) {

            mensagemLogin.textContent =
                "Digite seu e-mail.";

            return;

        }


        if (
            !senha
            ||
            senha.length < 6
        ) {

            mensagemLogin.textContent =
                "A senha precisa ter pelo menos 6 caracteres.";

            return;

        }


        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );


            mostrarToast(
                "Conta criada com sucesso."
            );

        }

        catch (erro) {

            console.error(
                "Erro ao criar conta:",
                erro
            );


            if (
                erro.code ===
                "auth/email-already-in-use"
            ) {

                mensagemLogin.textContent =
                    "Esse e-mail já possui uma conta.";

            }

            else if (
                erro.code ===
                "auth/invalid-email"
            ) {

                mensagemLogin.textContent =
                    "Digite um e-mail válido.";

            }

            else {

                mensagemLogin.textContent =
                    "Não foi possível criar a conta.";

            }

        }

    }
);



btnSair.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        }

        catch (erro) {

            console.error(
                "Erro ao sair:",
                erro
            );

        }

    }
);



/* =====================================================
   ESTADO DE AUTENTICAÇÃO
===================================================== */

onAuthStateChanged(
    auth,
    usuario => {

        if (usuario) {

            state.usuario =
                usuario;


            telaLogin.hidden =
                true;

            aplicativo.hidden =
                false;


            iniciarListenerTreinos();

            navegarPara(
                "inicio"
            );

        }

        else {

            state.usuario =
                null;

            state.treinos =
                [];

            state.treinoSelecionadoId =
                null;


            pararListenerTreinos();


            aplicativo.hidden =
                true;

            telaLogin.hidden =
                false;


            emailLogin.focus();

        }

    }
);



/* =====================================================
   FIRESTORE - TREINOS
===================================================== */

function pararListenerTreinos() {

    if (
        state.unsubscribeTreinos
    ) {

        state.unsubscribeTreinos();

        state.unsubscribeTreinos =
            null;

    }

}



function iniciarListenerTreinos() {

    if (
        !state.usuario?.uid
    ) {

        return;

    }


    pararListenerTreinos();


    state.carregandoTreinos =
        true;


    renderizarTreinos();


    const referencia =
        collection(
            db,
            "users",
            state.usuario.uid,
            "treinos"
        );


    state.unsubscribeTreinos =
        onSnapshot(

            referencia,

            snapshot => {

                state.treinos =
                    snapshot.docs
                        .map(
                            normalizarTreino
                        )
                        .sort(
                            (a, b) => {

                                const ordemA =
                                    a.criadoEm
                                    ||
                                    0;

                                const ordemB =
                                    b.criadoEm
                                    ||
                                    0;

                                return ordemA
                                    -
                                    ordemB;

                            }
                        );


                state.carregandoTreinos =
                    false;


                renderizarTudo();

            },

            erro => {

                console.error(
                    "Erro ao carregar treinos:",
                    erro
                );


                state.carregandoTreinos =
                    false;


                renderizarErroTreinos(
                    erro
                );

            }

        );

}



/* =====================================================
   SALVAR TREINO NO FIRESTORE
===================================================== */

async function salvarTreinoFirestore(
    treino
) {

    if (
        !state.usuario?.uid
    ) {

        throw new Error(
            "Usuário não autenticado."
        );

    }


    const referencia =
        doc(
            db,
            "users",
            state.usuario.uid,
            "treinos",
            treino.id
        );


    const dados = {

        nome:
            treino.nome,

        foco:
            treino.foco,

        exercicios:
            treino.exercicios,

        criadoEm:
            treino.criadoEm
            ||
            Date.now(),

        atualizadoEm:
            Date.now()

    };


    await setDoc(
        referencia,
        dados
    );

}



/* =====================================================
   NAVEGAÇÃO
===================================================== */

function navegarPara(
    pagina
) {

    const paginas = {

        inicio:
            paginaInicio,

        treinos:
            paginaTreinos,

        progresso:
            paginaProgresso,

        historico:
            paginaHistorico,

        detalhe:
            paginaDetalheTreino

    };


    document
        .querySelectorAll(".pagina")
        .forEach(
            elemento => {

                elemento.classList.remove(
                    "ativa"
                );

            }
        );


    const destino =
        paginas[pagina];


    if (destino) {

        destino.classList.add(
            "ativa"
        );

    }


    botoesNavegacao.forEach(
        botao => {

            botao.classList.remove(
                "ativo"
            );


            if (
                botao.dataset.pagina
                ===
                pagina
            ) {

                botao.classList.add(
                    "ativo"
                );

            }

        }
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



botoesNavegacao.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                navegarPara(
                    botao.dataset.pagina
                );

            }
        );

    }
);



/* =====================================================
   RENDER GERAL
===================================================== */

function renderizarTudo() {

    renderizarResumo();

    renderizarTreinos();


    if (
        state.treinoSelecionadoId
    ) {

        renderizarDetalheTreino();

    }

}



function renderizarResumo() {

    resumoTreinos.textContent =
        state.treinos.length;


    const quantidadeExercicios =
        state.treinos.reduce(
            (
                total,
                treino
            ) => {

                return total
                    +
                    treino.exercicios.length;

            },

            0
        );


    resumoExercicios.textContent =
        quantidadeExercicios;

}



/* =====================================================
   RENDER TREINOS
===================================================== */

function criarHTMLTreinos() {

    if (
        state.carregandoTreinos
    ) {

        return `

            <div class="estado-carregamento">

                <div class="spinner"></div>

                <p>
                    Carregando treinos...
                </p>

            </div>

        `;

    }


    if (
        state.treinos.length === 0
    ) {

        return `

            <div class="estado-vazio">

                <div class="estado-vazio-icone">
                    🏋️
                </div>

                <h3>
                    Nenhum treino cadastrado
                </h3>

                <p>
                    Crie sua primeira ficha
                    para começar.
                </p>

            </div>

        `;

    }


    return state.treinos
        .map(
            treino => {

                const quantidade =
                    treino
                        .exercicios
                        .length;


                return `

                    <article
                        class="treino-card"
                        data-treino-id="${treino.id}"
                    >

                        <div class="treino-card-topo">

                            <div>

                                <h3>
                                    ${
                                        escaparHTML(
                                            treino.nome
                                        )
                                    }
                                </h3>

                                <p class="treino-foco">

                                    ${
                                        escaparHTML(
                                            treino.foco
                                            ||
                                            "Sem foco definido"
                                        )
                                    }

                                </p>

                            </div>


                            <span class="treino-badge">

                                ${quantidade}

                                ${
                                    quantidade === 1
                                    ?
                                    "exercício"
                                    :
                                    "exercícios"
                                }

                            </span>

                        </div>


                        <div class="treino-card-rodape">

                            <span>
                                Abrir ficha
                            </span>

                            <span class="treino-seta">
                                →
                            </span>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}



function renderizarTreinos() {

    const html =
        criarHTMLTreinos();


    listaTreinosInicio.innerHTML =
        html;

    listaTreinos.innerHTML =
        html;

}



/* =====================================================
   ERRO FIRESTORE
===================================================== */

function renderizarErroTreinos(
    erro
) {

    let mensagem =
        "Não foi possível carregar seus treinos.";


    if (
        erro?.code
        ===
        "permission-denied"
    ) {

        mensagem =
            "O Firebase bloqueou o acesso. Confira as regras do Firestore.";

    }


    const html = `

        <div class="estado-vazio">

            <div class="estado-vazio-icone">
                ⚠️
            </div>

            <h3>
                Erro ao carregar
            </h3>

            <p>
                ${escaparHTML(mensagem)}
            </p>

        </div>

    `;


    listaTreinosInicio.innerHTML =
        html;

    listaTreinos.innerHTML =
        html;

}



/* =====================================================
   ABRIR TREINO
===================================================== */

function abrirTreino(
    treinoId
) {

    const treino =
        encontrarTreino(
            treinoId
        );


    if (!treino) {

        mostrarToast(
            "Treino não encontrado.",
            "erro"
        );

        return;

    }


    state.treinoSelecionadoId =
        treinoId;


    renderizarDetalheTreino();

    navegarPara(
        "detalhe"
    );

}



function eventoAbrirTreino(
    event
) {

    const card =
        event.target.closest(
            ".treino-card"
        );


    if (!card) {
        return;
    }


    abrirTreino(
        card.dataset.treinoId
    );

}



listaTreinosInicio.addEventListener(
    "click",
    eventoAbrirTreino
);


listaTreinos.addEventListener(
    "click",
    eventoAbrirTreino
);



btnVoltarTreinos.addEventListener(
    "click",
    () => {

        navegarPara(
            "treinos"
        );

    }
);



/* =====================================================
   DETALHE DO TREINO
===================================================== */

function renderizarDetalheTreino() {

    const treino =
        treinoSelecionado();


    if (!treino) {

        navegarPara(
            "treinos"
        );

        return;

    }


    detalheTreinoCodigo.textContent =
        "TREINO";


    detalheTreinoNome.textContent =
        treino.nome;


    detalheTreinoFoco.textContent =
        treino.foco
        ||
        "Sem foco definido";


    renderizarExercicios(
        treino
    );

}



/* =====================================================
   EXERCÍCIOS
===================================================== */

function renderizarExercicios(
    treino
) {

    if (
        treino.exercicios.length
        ===
        0
    ) {

        listaExerciciosDetalhe.innerHTML = `

            <div class="estado-vazio">

                <div class="estado-vazio-icone">
                    💪
                </div>

                <h3>
                    Nenhum exercício
                </h3>

                <p>
                    Adicione o primeiro exercício
                    deste treino.
                </p>

            </div>

        `;


        return;

    }


    listaExerciciosDetalhe.innerHTML =
        treino.exercicios
            .map(
                exercicio => {

                    const carga =
                        formatarCarga(
                            exercicio.carga
                        );

                    const incremento =
                        formatarCarga(
                            exercicio.incremento
                        );


                    return `

                        <article
                            class="exercicio-card"
                            data-exercicio-id="${exercicio.id}"
                        >


                            <div class="exercicio-card-topo">

                                <div>

                                    <h3>

                                        ${
                                            escaparHTML(
                                                exercicio.nome
                                            )
                                        }

                                    </h3>


                                    <p class="exercicio-meta">

                                        ${exercicio.series}
                                        séries

                                        •

                                        ${exercicio.repsMin}
                                        - 
                                        ${exercicio.repsMax}
                                        reps

                                        •

                                        ${exercicio.descanso}s
                                        descanso

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    class="exercicio-edit"
                                    data-acao="editar"
                                    aria-label="Editar exercício"
                                >
                                    ✎
                                </button>

                            </div>


                            <div class="carga-box">

                                <span class="carga-label">
                                    CARGA ATUAL
                                </span>


                                <div class="carga-controle">


                                    <button
                                        type="button"
                                        class="btn-carga"
                                        data-acao="diminuir"
                                    >
                                        −
                                    </button>


                                    <div class="carga-valor">

                                        ${carga}

                                        <span>
                                            kg
                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        class="btn-carga"
                                        data-acao="aumentar"
                                    >
                                        +
                                    </button>


                                </div>


                                <div class="carga-progressao">

                                    Progressão:
                                    ${incremento} kg

                                </div>

                            </div>


                            ${
                                exercicio.observacao
                                ?
                                `

                                    <p class="exercicio-meta"
                                       style="margin-top:12px;">

                                        ${
                                            escaparHTML(
                                                exercicio.observacao
                                            )
                                        }

                                    </p>

                                `
                                :
                                ""
                            }


                        </article>

                    `;

                }
            )
            .join("");

}



/* =====================================================
   ALTERAR CARGA
===================================================== */

async function alterarCarga(
    exercicioId,
    direcao
) {

    const treino =
        treinoSelecionado();


    if (!treino) {
        return;
    }


    const indice =
        treino.exercicios
            .findIndex(
                item =>
                    item.id
                    ===
                    exercicioId
            );


    if (
        indice === -1
    ) {

        return;

    }


    const exercicio =
        treino.exercicios[
            indice
        ];


    const cargaAnterior =
        exercicio.carga;


    const incremento =
        Math.max(
            0.5,
            exercicio.incremento
        );


    let novaCarga;


    if (
        direcao === "aumentar"
    ) {

        novaCarga =
            cargaAnterior
            +
            incremento;

    }

    else {

        novaCarga =
            Math.max(
                0,
                cargaAnterior
                -
                incremento
            );

    }


    novaCarga =
        Math.round(
            novaCarga * 100
        )
        /
        100;


    /*
        Atualização visual imediata
    */

    exercicio.carga =
        novaCarga;


    renderizarDetalheTreino();


    try {

        await salvarTreinoFirestore(
            treino
        );


        mostrarToast(
            `Carga: ${formatarCarga(novaCarga)} kg`
        );

    }

    catch (erro) {

        console.error(
            "Erro ao alterar carga:",
            erro
        );


        exercicio.carga =
            cargaAnterior;


        renderizarDetalheTreino();


        mostrarToast(
            "Não foi possível salvar a carga.",
            "erro"
        );

    }

}



/* =====================================================
   EVENTOS DOS EXERCÍCIOS
===================================================== */

listaExerciciosDetalhe.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                ".exercicio-card"
            );


        const botao =
            event.target.closest(
                "[data-acao]"
            );


        if (
            !card
            ||
            !botao
        ) {

            return;

        }


        const exercicioId =
            card.dataset.exercicioId;

        const acao =
            botao.dataset.acao;


        if (
            acao === "aumentar"
            ||
            acao === "diminuir"
        ) {

            alterarCarga(
                exercicioId,
                acao
            );

        }


        if (
            acao === "editar"
        ) {

            abrirModalEditarExercicio(
                exercicioId
            );

        }

    }
);



/* =====================================================
   MODAIS - FUNÇÕES
===================================================== */

function abrirModal(
    modal
) {

    modal.hidden =
        false;

    document.body.style.overflow =
        "hidden";

}



function fecharModal(
    modal
) {

    modal.hidden =
        true;

    document.body.style.overflow =
        "";

}



document
    .querySelectorAll(
        "[data-fechar-modal]"
    )
    .forEach(
        elemento => {

            elemento.addEventListener(
                "click",
                () => {

                    const tipo =
                        elemento.dataset
                            .fecharModal;


                    if (
                        tipo === "treino"
                    ) {

                        fecharModal(
                            modalTreino
                        );

                    }


                    if (
                        tipo === "exercicio"
                    ) {

                        fecharModal(
                            modalExercicio
                        );

                    }

                }
            );

        }
    );



/* =====================================================
   NOVO TREINO
===================================================== */

function abrirModalNovoTreino() {

    formTreino.reset();


    treinoIdInput.value =
        "";


    tituloModalTreino.textContent =
        "Novo treino";


    btnExcluirTreino.hidden =
        true;


    abrirModal(
        modalTreino
    );


    setTimeout(
        () => {

            nomeTreinoInput.focus();

        },

        50
    );

}



btnNovoTreinoInicio.addEventListener(
    "click",
    abrirModalNovoTreino
);


btnNovoTreino.addEventListener(
    "click",
    abrirModalNovoTreino
);



/* =====================================================
   EDITAR TREINO
===================================================== */

function abrirModalEditarTreino() {

    const treino =
        treinoSelecionado();


    if (!treino) {
        return;
    }


    treinoIdInput.value =
        treino.id;


    nomeTreinoInput.value =
        treino.nome;


    focoTreinoInput.value =
        treino.foco;


    tituloModalTreino.textContent =
        "Editar treino";


    btnExcluirTreino.hidden =
        false;


    abrirModal(
        modalTreino
    );

}



btnEditarTreino.addEventListener(
    "click",
    abrirModalEditarTreino
);



/* =====================================================
   SALVAR TREINO FORM
===================================================== */

formTreino.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (
            !state.usuario?.uid
        ) {

            return;

        }


        const nome =
            nomeTreinoInput
                .value
                .trim();


        const foco =
            focoTreinoInput
                .value
                .trim();


        if (!nome) {
            return;
        }


        const idExistente =
            treinoIdInput.value;


        /*
            EDIÇÃO
        */

        if (idExistente) {

            const treino =
                encontrarTreino(
                    idExistente
                );


            if (!treino) {
                return;
            }


            treino.nome =
                nome;

            treino.foco =
                foco;


            try {

                await salvarTreinoFirestore(
                    treino
                );


                fecharModal(
                    modalTreino
                );


                mostrarToast(
                    "Treino atualizado."
                );

            }

            catch (erro) {

                console.error(
                    erro
                );


                mostrarToast(
                    "Não foi possível atualizar.",
                    "erro"
                );

            }


            return;

        }


        /*
            NOVO TREINO
        */

        const novoTreino = {

            id:
                gerarId(),

            nome,

            foco,

            exercicios:
                [],

            criadoEm:
                Date.now(),

            atualizadoEm:
                Date.now()

        };


        try {

            await salvarTreinoFirestore(
                novoTreino
            );


            fecharModal(
                modalTreino
            );


            mostrarToast(
                "Treino criado."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            mostrarToast(
                "Não foi possível criar o treino.",
                "erro"
            );

        }

    }
);



/* =====================================================
   EXCLUIR TREINO
===================================================== */

btnExcluirTreino.addEventListener(
    "click",
    async () => {

        const treino =
            treinoSelecionado();


        if (!treino) {
            return;
        }


        const confirmado =
            window.confirm(
                `Excluir "${treino.nome}"?`
            );


        if (!confirmado) {
            return;
        }


        try {

            await deleteDoc(

                doc(
                    db,
                    "users",
                    state.usuario.uid,
                    "treinos",
                    treino.id
                )

            );


            state.treinoSelecionadoId =
                null;


            fecharModal(
                modalTreino
            );


            navegarPara(
                "treinos"
            );


            mostrarToast(
                "Treino excluído."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            mostrarToast(
                "Não foi possível excluir.",
                "erro"
            );

        }

    }
);



/* =====================================================
   NOVO EXERCÍCIO
===================================================== */

function abrirModalNovoExercicio() {

    const treino =
        treinoSelecionado();


    if (!treino) {

        mostrarToast(
            "Abra um treino primeiro.",
            "erro"
        );

        return;

    }


    formExercicio.reset();


    exercicioIdInput.value =
        "";


    seriesExercicioInput.value =
        3;

    repsMinExercicioInput.value =
        8;

    repsMaxExercicioInput.value =
        12;

    cargaExercicioInput.value =
        0;

    incrementoExercicioInput.value =
        2.5;

    descansoExercicioInput.value =
        90;

    observacaoExercicioInput.value =
        "";


    tituloModalExercicio.textContent =
        "Novo exercício";


    btnExcluirExercicio.hidden =
        true;


    abrirModal(
        modalExercicio
    );


    setTimeout(
        () => {

            nomeExercicioInput.focus();

        },

        50
    );

}



btnAdicionarExercicioDetalhe.addEventListener(
    "click",
    abrirModalNovoExercicio
);



/* =====================================================
   EDITAR EXERCÍCIO
===================================================== */

function abrirModalEditarExercicio(
    exercicioId
) {

    const treino =
        treinoSelecionado();


    if (!treino) {
        return;
    }


    const exercicio =
        treino.exercicios.find(
            item =>
                item.id
                ===
                exercicioId
        );


    if (!exercicio) {
        return;
    }


    exercicioIdInput.value =
        exercicio.id;


    nomeExercicioInput.value =
        exercicio.nome;


    seriesExercicioInput.value =
        exercicio.series;


    repsMinExercicioInput.value =
        exercicio.repsMin;


    repsMaxExercicioInput.value =
        exercicio.repsMax;


    cargaExercicioInput.value =
        exercicio.carga;


    incrementoExercicioInput.value =
        exercicio.incremento;


    descansoExercicioInput.value =
        exercicio.descanso;


    observacaoExercicioInput.value =
        exercicio.observacao;


    tituloModalExercicio.textContent =
        "Editar exercício";


    btnExcluirExercicio.hidden =
        false;


    abrirModal(
        modalExercicio
    );

}



/* =====================================================
   SALVAR EXERCÍCIO
===================================================== */

formExercicio.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const treino =
            treinoSelecionado();


        if (!treino) {
            return;
        }


        const nome =
            nomeExercicioInput
                .value
                .trim();


        const series =
            Math.max(
                1,
                numero(
                    seriesExercicioInput.value,
                    3
                )
            );


        let repsMin =
            Math.max(
                1,
                numero(
                    repsMinExercicioInput.value,
                    8
                )
            );


        let repsMax =
            Math.max(
                1,
                numero(
                    repsMaxExercicioInput.value,
                    12
                )
            );


        if (
            repsMin > repsMax
        ) {

            [
                repsMin,
                repsMax
            ]
            =
            [
                repsMax,
                repsMin
            ];

        }


        const carga =
            Math.max(
                0,
                numero(
                    cargaExercicioInput.value,
                    0
                )
            );


        const incremento =
            Math.max(
                0.5,
                numero(
                    incrementoExercicioInput.value,
                    2.5
                )
            );


        const descanso =
            Math.max(
                0,
                numero(
                    descansoExercicioInput.value,
                    90
                )
            );


        const observacao =
            observacaoExercicioInput
                .value
                .trim();


        const idExistente =
            exercicioIdInput.value;


        /*
            EDITAR
        */

        if (idExistente) {

            const indice =
                treino.exercicios
                    .findIndex(
                        item =>
                            item.id
                            ===
                            idExistente
                    );


            if (
                indice === -1
            ) {

                return;

            }


            treino.exercicios[
                indice
            ] = {

                ...treino.exercicios[
                    indice
                ],

                nome,

                series,

                repsMin,

                repsMax,

                carga,

                incremento,

                descanso,

                observacao

            };

        }


        /*
            NOVO
        */

        else {

            treino.exercicios.push({

                id:
                    gerarId(),

                nome,

                series,

                repsMin,

                repsMax,

                carga,

                incremento,

                descanso,

                observacao,

                ordem:
                    treino
                        .exercicios
                        .length

            });

        }


        try {

            await salvarTreinoFirestore(
                treino
            );


            fecharModal(
                modalExercicio
            );


            mostrarToast(
                idExistente
                ?
                "Exercício atualizado."
                :
                "Exercício adicionado."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            mostrarToast(
                "Não foi possível salvar o exercício.",
                "erro"
            );

        }

    }
);



/* =====================================================
   EXCLUIR EXERCÍCIO
===================================================== */

btnExcluirExercicio.addEventListener(
    "click",
    async () => {

        const treino =
            treinoSelecionado();


        if (!treino) {
            return;
        }


        const exercicioId =
            exercicioIdInput.value;


        const exercicio =
            treino.exercicios.find(
                item =>
                    item.id
                    ===
                    exercicioId
            );


        if (!exercicio) {
            return;
        }


        const confirmado =
            window.confirm(
                `Excluir "${exercicio.nome}"?`
            );


        if (!confirmado) {
            return;
        }


        treino.exercicios =
            treino.exercicios
                .filter(
                    item =>
                        item.id
                        !==
                        exercicioId
                )
                .map(
                    (
                        item,
                        indice
                    ) => ({

                        ...item,

                        ordem:
                            indice

                    })
                );


        try {

            await salvarTreinoFirestore(
                treino
            );


            fecharModal(
                modalExercicio
            );


            mostrarToast(
                "Exercício excluído."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            mostrarToast(
                "Não foi possível excluir.",
                "erro"
            );

        }

    }
);



/* =====================================================
   INICIAR TREINO
===================================================== */

btnIniciarTreino.addEventListener(
    "click",
    () => {

        const treino =
            treinoSelecionado();


        if (!treino) {
            return;
        }


        if (
            treino.exercicios.length
            ===
            0
        ) {

            mostrarToast(
                "Adicione exercícios antes de iniciar.",
                "erro"
            );

            return;

        }


        mostrarToast(
            "Execução do treino será nossa próxima etapa."
        );

    }
);



/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            !modalExercicio.hidden
        ) {

            fecharModal(
                modalExercicio
            );

            return;

        }


        if (
            !modalTreino.hidden
        ) {

            fecharModal(
                modalTreino
            );

        }

    }
);