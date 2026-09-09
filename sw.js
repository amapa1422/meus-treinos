/* =====================================================
   SERVICE WORKER - MEUS TREINOS
===================================================== */

const CACHE_NAME =
    "meus-treinos-v1";


const ARQUIVOS_ESTATICOS = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./firebase.js",

    "./manifest.json"

];


/* =====================================================
   INSTALAÇÃO
===================================================== */

self.addEventListener(
    "install",
    event => {

        self.skipWaiting();


        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(
                            ARQUIVOS_ESTATICOS
                        )
                )

        );

    }
);


/* =====================================================
   ATIVAÇÃO
===================================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    nomesCaches =>

                        Promise.all(

                            nomesCaches
                                .filter(
                                    nome =>
                                        nome !== CACHE_NAME
                                )
                                .map(
                                    nome =>
                                        caches.delete(
                                            nome
                                        )
                                )

                        )

                )

        );


        self.clients.claim();

    }
);


/* =====================================================
   FETCH
===================================================== */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        const url =
            new URL(
                request.url
            );


        /*
            Não interceptar Firebase / Google APIs.
            Deixa essas requisições seguirem normalmente.
        */

        const dominioExterno =

            url.hostname.includes(
                "googleapis.com"
            )

            ||

            url.hostname.includes(
                "firebaseio.com"
            )

            ||

            url.hostname.includes(
                "gstatic.com"
            )

            ||

            url.hostname.includes(
                "firebaseapp.com"
            );


        if (dominioExterno) {

            return;

        }


        /*
            Para navegação:
            tenta internet primeiro.
        */

        if (
            request.mode === "navigate"
        ) {

            event.respondWith(

                fetch(request)

                    .then(
                        resposta => {

                            const copia =
                                resposta.clone();


                            caches
                                .open(
                                    CACHE_NAME
                                )
                                .then(
                                    cache =>
                                        cache.put(
                                            "./index.html",
                                            copia
                                        )
                                );


                            return resposta;

                        }
                    )

                    .catch(
                        () =>
                            caches.match(
                                "./index.html"
                            )
                    )

            );


            return;

        }


        /*
            Para arquivos estáticos:
            cache primeiro.
        */

        event.respondWith(

            caches
                .match(request)
                .then(
                    respostaCache => {

                        if (
                            respostaCache
                        ) {

                            return respostaCache;

                        }


                        return fetch(
                            request
                        )
                        .then(
                            resposta => {

                                if (
                                    !resposta
                                    ||
                                    resposta.status !== 200
                                    ||
                                    resposta.type !== "basic"
                                ) {

                                    return resposta;

                                }


                                const copia =
                                    resposta.clone();


                                caches
                                    .open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        cache =>
                                            cache.put(
                                                request,
                                                copia
                                            )
                                    );


                                return resposta;

                            }
                        );

                    }
                )

        );

    }
);

/* =====================================================
   SERVICE WORKER
===================================================== */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator
                .serviceWorker
                .register("./sw.js")
                .catch(
                    erro => {

                        console.error(
                            "Erro ao registrar Service Worker:",
                            erro
                        );

                    }
                );

        }
    );

}