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


// ========================================
// ESTADO
// ========================================

let usuarioAtual = null;

let treinos = [];

let pararListenerTreinos = null;

let contadorExercicios = 0;


// ========================================
// ELEMENTOS
// ========================================

const telaLogin =
    document.getElementById("telaLogin");

const aplicativo =
    document.getElementById("aplicativo");

const formLogin =
    document.getElementById("formLogin");

const mensagemLogin =
    document.getElementById("mensagemLogin");

const btnCriarConta =
    document.getElementById("btnCriarConta");

const btnSair =
    document.getElementById("btnSair");

const btnNovoTreino =
    document.getElementById("btnNovoTreino");

const modalTreino =
    document.getElementById("modalTreino");

const fecharModalTreino =
    document.getElementById("fecharModalTreino");

const formTreino =
    document.getElementById("formTreino");

const btnAdicionarExercicio =
    document.getElementById("btnAdicionarExercicio");

const listaExerciciosForm =
    document.getElementById("listaExerciciosForm");

const listaTreinos =
    document.getElementById("listaTreinos");

const totalTreinos =
    document.getElementById("totalTreinos");

const totalExercicios =
    document.getElementById("totalExercicios");


// ========================================
// ID
// ========================================

function gerarId() {

    if (
        typeof crypto !== "undefined"
        &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }

    return Date.now().toString()
        +
        Math.random()
            .toString(16)
            .slice(2);

}


// ========================================
// LOGIN
// ========================================

formLogin.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        mensagemLogin.textContent = "";


        const email =
            document
                .getElementById("emailLogin")
                .value
                .trim();


        const senha =
            document
                .getElementById("senhaLogin")
                .value;


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

        } catch (erro) {

            console.error(erro);

            mensagemLogin.textContent =
                "E-mail ou senha incorretos.";

        }

    }
);


// ========================================
// CRIAR CONTA
// ========================================

btnCriarConta.addEventListener(
    "click",
    async () => {

        mensagemLogin.textContent = "";


        const email =
            document
                .getElementById("emailLogin")
                .value
                .trim();


        const senha =
            document
                .getElementById("senhaLogin")
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
                "Use uma senha com pelo menos 6 caracteres.";

            return;

        }


        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        } catch (erro) {

            console.error(erro);


            if (
                erro.code ===
                "auth/email-already-in-use"
            ) {

                mensagemLogin.textContent =
                    "Esse e-mail já possui uma conta.";

            } else {

                mensagemLogin.textContent =
                    "Não foi possível criar a conta.";

            }

        }

    }
);


// ========================================
// ESTADO DA CONTA
// ========================================

onAuthStateChanged(
    auth,
    usuario => {

        if (usuario) {

            usuarioAtual = usuario;

            telaLogin.style.display =
                "none";

            aplicativo.style.display =
                "block";

            carregarTreinos();

        }

        else {

            usuarioAtual = null;

            treinos = [];


            if (pararListenerTreinos) {

                pararListenerTreinos();

                pararListenerTreinos = null;

            }


            telaLogin.style.display =
                "flex";

            aplicativo.style.display =
                "none";

        }

    }
);


// ========================================
// SAIR
// ========================================

btnSair.addEventListener(
    "click",
    async () => {

        await signOut(auth);

    }
);


// ========================================
// FIRESTORE
// ========================================

function carregarTreinos() {

    if (!usuarioAtual) {
        return;
    }


    if (pararListenerTreinos) {

        pararListenerTreinos();

    }


    const referencia =
        collection(
            db,
            "users",
            usuarioAtual.uid,
            "treinos"
        );


    pararListenerTreinos =
        onSnapshot(
            referencia,
            snapshot => {

                treinos =
                    snapshot.docs.map(
                        documento => ({

                            id: documento.id,

                            ...documento.data()

                        })
                    );


                treinos.sort(
                    (a, b) =>
                        Number(a.criadoEm || 0)
                        -
                        Number(b.criadoEm || 0)
                );


                renderizarTreinos();

            },

            erro => {

                console.error(
                    "Erro ao carregar treinos:",
                    erro
                );

            }
        );

}


// ========================================
// MODAL
// ========================================

function abrirModal() {

    modalTreino.classList.add(
        "ativo"
    );


    if (
        listaExerciciosForm.children.length === 0
    ) {

        adicionarExercicioForm();

    }

}


function fecharModal() {

    modalTreino.classList.remove(
        "ativo"
    );

}


btnNovoTreino.addEventListener(
    "click",
    abrirModal
);


fecharModalTreino.addEventListener(
    "click",
    fecharModal
);


modalTreino.addEventListener(
    "click",
    event => {

        if (
            event.target === modalTreino
        ) {

            fecharModal();

        }

    }
);


// ========================================
// EXERCÍCIOS DO FORM
// ========================================

function adicionarExercicioForm() {

    contadorExercicios++;


    const div =
        document.createElement("div");


    div.className =
        "exercicio-form";


    div.innerHTML = `

        <div class="exercicio-form-topo">

            <strong>
                Exercício ${contadorExercicios}
            </strong>

            <button
                type="button"
                class="remover-exercicio"
            >
                Remover
            </button>

        </div>


        <input
            class="exercicio-nome"
            type="text"
            placeholder="Ex: Supino reto"
            required
        >


        <div class="linha-exercicio">

            <input
                class="exercicio-series"
                type="number"
                min="1"
                max="20"
                placeholder="Séries"
                required
            >

            <input
                class="exercicio-reps"
                type="text"
                placeholder="Reps: 8-12"
                required
            >

            <input
                class="exercicio-carga"
                type="number"
                min="0"
                step="0.5"
                placeholder="Carga kg"
            >

        </div>

    `;


    div
        .querySelector(
            ".remover-exercicio"
        )
        .addEventListener(
            "click",
            () => {

                div.remove();

            }
        );


    listaExerciciosForm
        .appendChild(div);

}


btnAdicionarExercicio.addEventListener(
    "click",
    adicionarExercicioForm
);


// ========================================
// SALVAR TREINO
// ========================================

formTreino.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!usuarioAtual) {
            return;
        }


        const nome =
            document
                .getElementById("nomeTreino")
                .value
                .trim();


        const foco =
            document
                .getElementById("focoTreino")
                .value
                .trim();


        const elementos =
            listaExerciciosForm
                .querySelectorAll(
                    ".exercicio-form"
                );


        const exercicios = [];


        elementos.forEach(
            elemento => {

                const exercicio = {

                    id: gerarId(),

                    nome:
                        elemento
                            .querySelector(
                                ".exercicio-nome"
                            )
                            .value
                            .trim(),

                    series:
                        Number(
                            elemento
                                .querySelector(
                                    ".exercicio-series"
                                )
                                .value
                        ),

                    reps:
                        elemento
                            .querySelector(
                                ".exercicio-reps"
                            )
                            .value
                            .trim(),

                    carga:
                        Number(
                            elemento
                                .querySelector(
                                    ".exercicio-carga"
                                )
                                .value
                                ||
                                0
                        )

                };


                exercicios.push(
                    exercicio
                );

            }
        );


        if (
            exercicios.length === 0
        ) {

            alert(
                "Adicione pelo menos um exercício."
            );

            return;

        }


        const id =
            gerarId();


        const novoTreino = {

            nome,

            foco,

            exercicios,

            criadoEm:
                Date.now()

        };


        try {

            await setDoc(

                doc(
                    db,
                    "users",
                    usuarioAtual.uid,
                    "treinos",
                    id
                ),

                novoTreino

            );


            formTreino.reset();

            listaExerciciosForm.innerHTML =
                "";

            contadorExercicios = 0;

            fecharModal();


        } catch (erro) {

            console.error(
                "Erro ao salvar treino:",
                erro
            );


            alert(
                "Não foi possível salvar o treino."
            );

        }

    }
);


// ========================================
// EXCLUIR
// ========================================

async function excluirTreino(id) {

    if (!usuarioAtual) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja excluir este treino?"
        );


    if (!confirmar) {
        return;
    }


    await deleteDoc(

        doc(
            db,
            "users",
            usuarioAtual.uid,
            "treinos",
            id
        )

    );

}


// ========================================
// RENDER
// ========================================

function renderizarTreinos() {

    listaTreinos.innerHTML =
        "";


    totalTreinos.textContent =
        treinos.length;


    const quantidadeExercicios =
        treinos.reduce(
            (total, treino) =>
                total
                +
                (
                    treino.exercicios
                        ?.length
                    ||
                    0
                ),

            0
        );


    totalExercicios.textContent =
        quantidadeExercicios;


    if (
        treinos.length === 0
    ) {

        listaTreinos.innerHTML = `

            <div class="vazio">

                Você ainda não cadastrou
                nenhum treino.

            </div>

        `;


        return;

    }


    treinos.forEach(
        treino => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "treino-card";


            const exerciciosHTML =
                (
                    treino.exercicios
                    ||
                    []
                )
                .map(
                    exercicio => `

                        <div class="exercicio-item">

                            <div>

                                <strong>
                                    ${exercicio.nome}
                                </strong>

                                <span>
                                    ${exercicio.series}
                                    séries •
                                    ${exercicio.reps}
                                    reps
                                </span>

                            </div>

                            <div class="carga">

                                ${
                                    Number(
                                        exercicio.carga
                                    )
                                    > 0

                                    ?
                                    `${exercicio.carga} kg`

                                    :
                                    "—"
                                }

                            </div>

                        </div>

                    `
                )
                .join("");


            card.innerHTML = `

                <div class="treino-topo">

                    <div>

                        <h3>
                            ${treino.nome}
                        </h3>

                        <p class="foco-treino">
                            ${treino.foco}
                        </p>

                    </div>


                    <span class="badge-exercicios">

                        ${
                            treino.exercicios
                                ?.length
                            ||
                            0
                        }
                        exercícios

                    </span>

                </div>


                <div class="exercicios-treino">

                    ${exerciciosHTML}

                </div>


                <div class="acoes-treino">

                    <button
                        class="btn-excluir"
                        data-id="${treino.id}"
                    >
                        Excluir treino
                    </button>

                </div>

            `;


            card
                .querySelector(
                    ".btn-excluir"
                )
                .addEventListener(
                    "click",
                    () =>
                        excluirTreino(
                            treino.id
                        )
                );


            listaTreinos
                .appendChild(card);

        }
    );

}