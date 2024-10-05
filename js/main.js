let datosComponentes = {};

async function cargarDatos() {
    const urls = {
        procesadoresIntel: './json/procesadoresIntel.json',
        procesadoresAmd: './json/procesadoresAmd.json',
        motherboardsIntel: './json/motherboardIntel.json',
        motherboardsAmd: './json/motherboardAmd.json',
        gpusNvidia: './json/gpusNvidia.json',
        gpusRadeon: './json/gpusRadeon.json',
        almacenamientoHdd: './json/hdd.json',
        almacenamientoSsd: './json/ssd.json',
        fuentes: './json/fuentedepoder.json',
        ram: './json/ram.json',
        gabinetes: './json/gabinetes.json'
    };

    for (let categoria in urls) {
        try {
            const response = await fetch(urls[categoria]);
            if (!response.ok) {
                throw new Error(`Error al cargar ${urls[categoria]}: ${response.statusText}`);
            }
            datosComponentes[categoria] = await response.json();
            console.log(`Datos cargados para ${categoria}:`, datosComponentes[categoria]);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }
}

function mostrarDatos() {
    const categoria = document.getElementById("categoria").value;
    const subcategoria = document.getElementById("subcategoria").value;
    const resultado = document.getElementById("resultado");

    let datos = subcategoria ? datosComponentes[subcategoria] : datosComponentes[categoria];

    if (!datos || datos.length === 0) {
        resultado.innerHTML = `<p>No se encontraron datos para la selección realizada.</p>`;
        return;
    }

    resultado.innerHTML = `<h2>Resultados de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}:</h2>`;

    datos.forEach(item => {
        const { modelo, precio, imagen } = item;
        resultado.innerHTML += `
            <div class="resultado-item">
                <img src="${imagen}" alt="${modelo}" class="resultado-img"> <!-- Mostrar la imagen -->
                <p>${modelo} - $${precio}</p>
                <button onclick="añadirAlCarrito('${modelo}', ${precio}, '${imagen}')">Añadir al Carrito</button>
            </div>
        `;
    });
}

function actualizarSubcategoria() {
    const categoria = document.getElementById("categoria").value;
    const subcategoriaContainer = document.getElementById("subcategoriaContainer");
    const subcategoriaSelect = document.getElementById("subcategoria");

    let subcategorias = [];

    if (categoria === "procesadores") {
        subcategorias = [
            { value: "procesadoresIntel", label: "Intel" },
            { value: "procesadoresAmd", label: "AMD" }
        ];
    } else if (categoria === "motherboards") {
        subcategorias = [
            { value: "motherboardsIntel", label: "Intel" },
            { value: "motherboardsAmd", label: "AMD" }
        ];
    } else if (categoria === "tarjetas") {
        subcategorias = [
            { value: "gpusNvidia", label: "NVIDIA" },
            { value: "gpusRadeon", label: "Radeon" }
        ];
    } else if (categoria === "almacenamiento") {
        subcategorias = [
            { value: "almacenamientoHdd", label: "HDD" },
            { value: "almacenamientoSsd", label: "SSD" }
        ];
    }

    subcategoriaContainer.style.display = subcategorias.length > 0 ? 'block' : 'none';
    subcategoriaSelect.innerHTML = '<option value="">Selecciona una subcategoría</option>';
    
    subcategorias.forEach(sub => {
        subcategoriaSelect.innerHTML += `<option value="${sub.value}">${sub.label}</option>`;
    });
}

function validarFormulario() {
    const categoria = document.getElementById("categoria").value;
    if (!categoria) {
        alert("Por favor, selecciona una categoría.");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatos();
    actualizarCarrito();

    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    if (carritoItems.length > 0) {
        Swal.fire({
            icon: 'info',
            title: 'No te olvides de completar tu compra!',
            text: 'Tienes artículos en tu carrito.',
            confirmButtonText: 'OK'
        });
    }
});