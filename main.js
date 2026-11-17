
const URL = "https://api.fda.gov/drug/label.json?search=effective_time:%5B20090601%20TO%2020261117%5D&limit=100";

const contenedor = document.getElementById("resultados");
const buscador = document.getElementById("buscador");
const boton = document.getElementById("btnBuscar");

let medicamentos = [];

async function obtenerMedicamentos() {

    try {

        contenedor.innerHTML = "<p>Cargando medicamentos...</p>";

        const respuesta = await fetch(URL);

        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        const datos = await respuesta.json();

        medicamentos = datos.results || [];

        mostrarMedicamentos(medicamentos);

    } catch (error) {

        console.error("Error:", error);

        contenedor.innerHTML = `
            <p>No se pudieron cargar los medicamentos.</p>
            <p>${error.message}</p>
        `;

    }

}

function mostrarMedicamentos(lista) {

    contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron medicamentos.</p>";
        return;
    }

    lista.forEach(medicamento => {

        const nombre = medicamento.openfda?.brand_name?.[0] || "Sin nombre";

        const ingrediente = medicamento.openfda?.generic_name?.[0] || "No disponible";

        const fabricante = medicamento.openfda?.manufacturer_name?.[0] || "No disponible";

        const fecha = medicamento.effective_time || "No disponible";

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("container-medicamento");

        const titulo = document.createElement("h3");
        titulo.textContent = nombre;

        const pIngrediente = document.createElement("p");
        pIngrediente.textContent = "Ingrediente: " + ingrediente;

        const pFabricante = document.createElement("p");
        pFabricante.textContent = "Fabricante: " + fabricante;

        const pFecha = document.createElement("p");
        pFecha.textContent = "Fecha: " + fecha;

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(pIngrediente);
        tarjeta.appendChild(pFabricante);
        tarjeta.appendChild(pFecha);

        contenedor.appendChild(tarjeta);

    });

}

function buscarMedicamento() {

    const texto = buscador.value.toLowerCase().trim();

    const filtrados = medicamentos.filter(medicamento => {

        const nombre = medicamento.openfda?.brand_name?.[0] || "";
        const ingrediente = medicamento.openfda?.generic_name?.[0] || "";

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
