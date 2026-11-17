
const contenedor = document.getElementById("resultados");
const buscador = document.getElementById("buscador");
const boton = document.getElementById("btnBuscar");

let medicamentos = [];

async function obtenerMedicamentos() {

    try {

        contenedor.innerHTML = "<p>Cargando medicamentos...</p>";

        const respuesta = await fetch(
            "https://api.fda.gov/drug/ndc.json?limit=100"
        );

        if (!respuesta.ok) {
            throw new Error("Error al obtener los medicamentos");
        }

        const datos = await respuesta.json();

        medicamentos = datos.results;

        mostrarMedicamentos(medicamentos);

    } catch (error) {

        contenedor.innerHTML =
            "<p>Error al cargar los medicamentos.</p>";

        console.log(error);

    }

}

function mostrarMedicamentos(lista) {

    contenedor.innerHTML = "";

    if (lista.length === 0) {

        contenedor.innerHTML =
            "<p>No se encontraron medicamentos.</p>";

        return;

    }

    lista.forEach(medicamento => {

        const nombre =
            medicamento.brand_name || "Sin nombre";

        const ingrediente =
            medicamento.active_ingredients?.[0]?.name ||
            "No disponible";

        const fabricante =
            medicamento.labeler_name || "No disponible";

        const forma =
            medicamento.dosage_form || "No disponible";

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("container-medicamento");

        tarjeta.innerHTML = `
            <h3>${nombre}</h3>

            <p><strong>Ingrediente:</strong> ${ingrediente}</p>

            <p><strong>Fabricante:</strong> ${fabricante}</p>

            <p><strong>Presentación:</strong> ${forma}</p>
        `;

        contenedor.appendChild(tarjeta);

    });

}

function buscarMedicamento() {

    const texto = buscador.value.toLowerCase().trim();

    const filtrados = medicamentos.filter(medicamento => {

        const nombre = medicamento.brand_name || "";

        const ingrediente =
            medicamento.active_ingredients?.[0]?.name || "";

        return nombre.toLowerCase().includes(texto) ||
               ingrediente.toLowerCase().includes(texto);

    });

    mostrarMedicamentos(filtrados);

}

boton.addEventListener("click", buscarMedicamento);

buscador.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        buscarMedicamento();
    }

});

obtenerMedicamentos();
