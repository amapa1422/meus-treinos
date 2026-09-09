const CACHE =
    "meus-treinos-v1";


const arquivos = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./firebase.js",

    "./manifest.json"

];


self.addEventListener(
    "install",
    event => {

        self.skipWaiting();


        event.waitUntil(

            caches
                .open(CACHE)
                .then(
                    cache =>
                        cache.addAll(
                            arquivos
                        )
                )

        );

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    nomes =>

                        Promise.all(

                            nomes
                                .filter(
                                    nome =>
                                        nome !== CACHE
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


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            fetch(event.request)

                .catch(
                    () =>
                        caches.match(
                            event.request
                        )
                )

        );

    }
);