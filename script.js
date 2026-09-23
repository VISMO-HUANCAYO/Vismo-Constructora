/* =========================================================
   CATÁLOGO DE FACHADAS VISMO
   ========================================================= */


/* =========================================================
   ARCHIVOS DE LAS FACHADAS
========================================================= */

const fachadas = [

    "1.webp",
    "2.jpg",
    "3.png",
    "4.png",
    "5.webp",
    "6.webp",
    "7.webp",
    "8.webp",
    "9.webp",
    "10.jpg",

    "11.webp",
    "12.webp",
    "13.webp",

    "14.png",
    "15.png",
    "16.png",
    "17.png",
    "18.png",
    "19.png",
    "20.png",
    "21.png",
    "22.png",
    "23.png",

    "24.png",
    "25.png",
    "26.png",
    "27.png",
    "28.png",
    "29.png",
    "30.png",
    "31.png",
    "32.png",
    "33.png",

    "34.png",
    "35.png",
    "36.png",
    "37.png",
    "38.png",
    "39.png",
    "40.png",
    "41.png",

    "42.webp",
    "43.webp"

];


/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const grid = document.getElementById("fachadasGrid");

const contadorFavoritas =
    document.getElementById("contadorFavoritas");

const favoritasFlotante =
    document.getElementById("favoritasFlotante");

const favoritasMiniaturas =
    document.getElementById("favoritasMiniaturas");

const cantidadResumen =
    document.getElementById("cantidadResumen");


/* =========================================================
   MODAL
========================================================= */

const modal =
    document.getElementById("modal");

const modalImagen =
    document.getElementById("modalImagen");

const modalNumero =
    document.getElementById("modalNumero");

const modalCerrar =
    document.getElementById("modalCerrar");

const modalAnterior =
    document.getElementById("modalAnterior");

const modalSiguiente =
    document.getElementById("modalSiguiente");

const modalFavorita =
    document.getElementById("modalFavorita");


/* =========================================================
   INSPIRACIÓN
========================================================= */

const inputReferencia =
    document.getElementById("imagenReferencia");

const previewReferencia =
    document.getElementById("previewReferencia");


/* =========================================================
   FORMULARIO
========================================================= */

const formulario =
    document.getElementById("formPreferencias");


/* =========================================================
   VARIABLES
========================================================= */

let favoritas = [];

let fachadaActual = 0;

let pisosSeleccionados = "";



/* =========================================================
   CREAR CATÁLOGO
========================================================= */

fachadas.forEach((archivo, indice) => {

    const numero = indice + 1;

    const card =
        document.createElement("article");

    card.className = "fachada-card";


    card.innerHTML = `

        <div
            class="fachada-imagen"
            data-indice="${indice}"
        >

            <img
                src="imagenes/${archivo}"
                alt="VISMO ${numero}"
                loading="lazy"
                class="imagen-fachada"
            >

            <img
                src="imagenes/marca-vismo.png"
                alt=""
                class="marca-agua"
            >

        </div>


        <div class="fachada-info">

            <span class="fachada-numero">
                VISMO ${numero}
            </span>


            <button
                class="btn-corazon"
                type="button"
                data-numero="${numero}"
                aria-label="Seleccionar VISMO ${numero}"
            >
                ♡
            </button>

        </div>

    `;


    grid.appendChild(card);

});



/* =========================================================
   ABRIR FACHADA
========================================================= */

document
    .querySelectorAll(".fachada-imagen")
    .forEach(imagen => {

        imagen.addEventListener(
            "click",
            () => {

                abrirModal(
                    Number(imagen.dataset.indice)
                );

            }
        );

    });



function abrirModal(indice) {

    fachadaActual = indice;


    modalImagen.src =
        `imagenes/${fachadas[indice]}`;


    modalNumero.textContent =
        `VISMO ${indice + 1}`;


    actualizarBotonModal();


    modal.classList.add("abierto");


    document.body.style.overflow =
        "hidden";

}



/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModal() {

    modal.classList.remove("abierto");

    document.body.style.overflow = "";

}


modalCerrar.addEventListener(
    "click",
    cerrarModal
);



modal.addEventListener(
    "click",
    evento => {

        if (evento.target === modal) {

            cerrarModal();

        }

    }
);



/* =========================================================
   SIGUIENTE FACHADA
========================================================= */

modalSiguiente.addEventListener(
    "click",
    () => {

        fachadaActual++;


        if (
            fachadaActual >= fachadas.length
        ) {

            fachadaActual = 0;

        }


        abrirModal(fachadaActual);

    }
);



/* =========================================================
   FACHADA ANTERIOR
========================================================= */

modalAnterior.addEventListener(
    "click",
    () => {

        fachadaActual--;


        if (fachadaActual < 0) {

            fachadaActual =
                fachadas.length - 1;

        }


        abrirModal(fachadaActual);

    }
);



/* =========================================================
   CORAZONES DEL CATÁLOGO
========================================================= */

document
    .querySelectorAll(".btn-corazon")
    .forEach(boton => {

        boton.addEventListener(
            "click",
            evento => {

                evento.stopPropagation();


                cambiarFavorita(
                    Number(
                        boton.dataset.numero
                    )
                );

            }
        );

    });



/* =========================================================
   AGREGAR / QUITAR FAVORITA
========================================================= */

function cambiarFavorita(numero) {

    if (
        favoritas.includes(numero)
    ) {

        favoritas =
            favoritas.filter(
                item => item !== numero
            );

    }

    else {

        favoritas.push(numero);

    }


    favoritas.sort(
        (a, b) => a - b
    );


    actualizarFavoritas();

}



/* =========================================================
   ACTUALIZAR FAVORITAS
========================================================= */

function actualizarFavoritas() {


    contadorFavoritas.textContent =
        favoritas.length;



    document
        .querySelectorAll(".btn-corazon")
        .forEach(boton => {


            const numero =
                Number(
                    boton.dataset.numero
                );


            if (
                favoritas.includes(numero)
            ) {

                boton.textContent = "♥";

                boton.classList.add(
                    "activo"
                );

            }

            else {

                boton.textContent = "♡";

                boton.classList.remove(
                    "activo"
                );

            }

        });



    cantidadResumen.textContent =

        `${favoritas.length} ${
            favoritas.length === 1
                ? "seleccionada"
                : "seleccionadas"
        }`;


    actualizarMiniaturas();

    actualizarBotonModal();

}



/* =========================================================
   MINIATURAS DE FAVORITAS
========================================================= */

function actualizarMiniaturas() {


    if (
        favoritas.length === 0
    ) {

        favoritasMiniaturas.innerHTML = `

            <p class="sin-favoritas">

                Aún no has seleccionado
                ninguna fachada.

            </p>

        `;


        return;

    }



    favoritasMiniaturas.innerHTML =

        favoritas
            .map(numero => {


                const archivo =
                    fachadas[numero - 1];


                return `

                    <div class="favorita-mini">


                        <img
                            src="imagenes/${archivo}"
                            alt="VISMO ${numero}"
                        >


                        <span
                            class="favorita-mini-numero"
                        >

                            VISMO ${numero}

                        </span>


                        <button
                            type="button"
                            class="quitar-favorita"
                            data-quitar="${numero}"
                            aria-label="Quitar VISMO ${numero}"
                        >

                            ×

                        </button>


                    </div>

                `;

            })
            .join("");



    document
        .querySelectorAll(
            ".quitar-favorita"
        )
        .forEach(boton => {


            boton.addEventListener(
                "click",
                () => {


                    cambiarFavorita(

                        Number(
                            boton.dataset.quitar
                        )

                    );


                }
            );

        });

}



/* =========================================================
   FAVORITA DESDE MODAL
========================================================= */

modalFavorita.addEventListener(
    "click",
    () => {

        cambiarFavorita(
            fachadaActual + 1
        );

    }
);



function actualizarBotonModal() {


    const numero =
        fachadaActual + 1;


    modalFavorita.textContent =

        favoritas.includes(numero)

            ? "♥ SELECCIONADA"

            : "♡ AGREGAR A FAVORITAS";

}



/* =========================================================
   BOTÓN FLOTANTE
========================================================= */

favoritasFlotante.addEventListener(
    "click",
    () => {

        document
            .getElementById("formulario")
            .scrollIntoView({

                behavior: "smooth"

            });

    }
);



/* =========================================================
   NÚMERO DE PISOS
========================================================= */

document
    .querySelectorAll(
        "#pisosOpciones button"
    )
    .forEach(boton => {


        boton.addEventListener(
            "click",
            () => {


                document
                    .querySelectorAll(
                        "#pisosOpciones button"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "activo"
                            )
                    );


                boton.classList.add(
                    "activo"
                );


                pisosSeleccionados =
                    boton.dataset.pisos;

            }
        );

    });



/* =========================================================
   IMAGEN DE INSPIRACIÓN
========================================================= */

inputReferencia.addEventListener(
    "change",
    () => {


        const archivo =
            inputReferencia.files[0];


        if (!archivo) {

            previewReferencia.innerHTML =
                "";

            return;

        }



        if (
            !archivo.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Por favor selecciona una imagen."
            );


            inputReferencia.value = "";


            return;

        }



        const lector =
            new FileReader();



        lector.onload =
            evento => {


                previewReferencia.innerHTML = `

                    <img
                        src="${evento.target.result}"
                        alt="Inspiración del cliente"
                    >

                    <p
                        style="
                            margin-top:10px;
                            font-size:12px;
                        "
                    >

                        ✓ Imagen de inspiración seleccionada

                    </p>

                `;

            };


        lector.readAsDataURL(
            archivo
        );

    }
);



/* =========================================================
   TECLADO EN MODAL
========================================================= */

document.addEventListener(
    "keydown",
    evento => {


        if (
            !modal.classList.contains(
                "abierto"
            )
        ) {

            return;

        }


        if (
            evento.key === "Escape"
        ) {

            cerrarModal();

        }


        if (
            evento.key === "ArrowRight"
        ) {

            modalSiguiente.click();

        }


        if (
            evento.key === "ArrowLeft"
        ) {

            modalAnterior.click();

        }

    }
);



/* =========================================================
   ENVIAR FORMULARIO A BASIN
========================================================= */

formulario.addEventListener(
    "submit",
    async evento => {


        evento.preventDefault();



        const nombre =

            document
                .getElementById("nombre")
                .value
                .trim();



        const frente =

            document
                .getElementById("frente")
                .value;



        const preferencias =

            Array.from(

                document.querySelectorAll(
                    ".chips-preferencias input:checked"
                )

            ).map(
                input => input.value
            );



        /* ---------------------------------------------
           VALIDAR NOMBRE
        --------------------------------------------- */

        if (!nombre) {

            alert(
                "Por favor escribe tu nombre."
            );

            return;

        }



        /* ---------------------------------------------
           DEBE ELEGIR UNA FACHADA O SUBIR REFERENCIA
        --------------------------------------------- */

        if (

            favoritas.length === 0 &&

            inputReferencia.files.length === 0

        ) {

            alert(

                "Selecciona al menos una propuesta VISMO o sube una imagen de inspiración."

            );

            return;

        }



        /* ---------------------------------------------
           PREPARAR INFORMACIÓN
        --------------------------------------------- */

        document
            .getElementById(
                "favoritasInput"
            )
            .value =

            favoritas.length

                ? favoritas
                    .map(
                        numero =>
                            `VISMO ${numero}`
                    )
                    .join(", ")

                : "No seleccionó fachadas del catálogo";



        document
            .getElementById(
                "pisosInput"
            )
            .value =

            pisosSeleccionados ||
            "No indicado";



        document
            .getElementById(
                "preferenciasInput"
            )
            .value =

            preferencias.length

                ? preferencias.join(", ")

                : "No indicado";



        document
            .getElementById(
                "frenteInput"
            )
            .value =

            frente

                ? `${frente} m`

                : "No indicado";



        /* ---------------------------------------------
           BOTÓN ENVIANDO
        --------------------------------------------- */

        const botonEnviar =

            formulario.querySelector(
                ".btn-enviar"
            );


        const textoOriginal =

            botonEnviar.textContent;



        botonEnviar.disabled = true;


        botonEnviar.textContent =

            "ENVIANDO TU SELECCIÓN...";



        try {


            /* -----------------------------------------
               CREAR DATOS DEL FORMULARIO
            ----------------------------------------- */

            // Copia local para el panel interno del Sistema VISMO (prototipo)
            try {
                const registro = {
                    id: "FAC-" + Date.now(),
                    fecha: new Date().toLocaleString("es-PE"),
                    nombre: nombre,
                    frente: frente || "",
                    pisos: pisosSeleccionados || "",
                    favoritas: favoritas.map(n => `VISMO ${n}`),
                    preferencias: preferencias
                };
                const historial = JSON.parse(localStorage.getItem("vismo_catalogo_respuestas") || "[]");
                historial.unshift(registro);
                localStorage.setItem("vismo_catalogo_respuestas", JSON.stringify(historial));
            } catch(e) { console.warn("No se pudo guardar copia local VISMO", e); }

            const datos =
                new FormData(formulario);



            /* -----------------------------------------
               AGREGAR IMAGEN DE INSPIRACIÓN
               El input está fuera del formulario.
            ----------------------------------------- */

            if (
                inputReferencia.files.length > 0
            ) {

                datos.append(

                    "Imagen de inspiración",

                    inputReferencia.files[0]

                );

            }



            /* -----------------------------------------
               ENVIAR A BASIN
            ----------------------------------------- */

            const respuesta =

                await fetch(
                    formulario.action,
                    {

                        method: "POST",

                        body: datos,

                        headers: {

                            "Accept":
                                "application/json"

                        }

                    }
                );



            /* -----------------------------------------
               VERIFICAR RESPUESTA
            ----------------------------------------- */

            if (!respuesta.ok) {


                const mensaje =

                    await respuesta.text();


                console.error(

                    "Respuesta de Basin:",

                    mensaje

                );


                throw new Error(

                    "No se pudo enviar el formulario."

                );

            }



            /* -----------------------------------------
               ENVÍO CORRECTO
            ----------------------------------------- */

            const contenedor =

                document.querySelector(
                    ".formulario-container"
                );



            contenedor.innerHTML = `


                <div class="gracias">


                    <p class="section-number">

                        SELECCIÓN RECIBIDA

                    </p>


                    <div class="gracias-simbolo">

                        ✓

                    </div>


                    <h2>

                        Gracias,<br>

                        ${escaparHTML(nombre)}.

                    </h2>


                    <p class="gracias-texto">

                        Ya conocemos un poco mejor
                        la fachada que imaginas.

                    </p>


                    <p class="gracias-texto">

                        Tus referencias serán el punto
                        de partida para desarrollar una
                        propuesta pensada especialmente
                        para tu vivienda.

                    </p>


                    <div class="gracias-seleccion">


                        <span>

                            TU SELECCIÓN

                        </span>


                        <strong>

                            ${
                                favoritas.length

                                    ? favoritas
                                        .map(
                                            numero =>
                                                `VISMO ${numero}`
                                        )
                                        .join(" · ")

                                    : "Referencia propia"
                            }

                        </strong>


                    </div>
          
                    <p class="gracias-frase">

                        Visión y modernidad para vivir mejor.

                    </p>


                </div>

            `;



            favoritasFlotante.style.display =
                "none";



            document
                .querySelector(
                    ".formulario-section"
                )
                .scrollIntoView({

                    behavior: "smooth"

                });


        }

        catch (error) {


            console.error(
                "Error al enviar a Basin:",
                error
            );


            alert(

                "No pudimos enviar tu selección. Por favor inténtalo nuevamente."

            );


            botonEnviar.disabled =
                false;


            botonEnviar.textContent =
                textoOriginal;

        }


    }
);



/* =========================================================
   SEGURIDAD PARA MOSTRAR EL NOMBRE
========================================================= */

function escaparHTML(texto) {


    const elemento =
        document.createElement("div");


    elemento.textContent =
        texto;


    return elemento.innerHTML;

}