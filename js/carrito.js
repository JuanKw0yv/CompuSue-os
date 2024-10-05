function añadirAlCarrito(nombre, precio, imagen) {
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    carritoItems.push({ nombre, precio, imagen });
    localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
    actualizarCarrito();
}


function actualizarCarrito() {
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    const carritoLista = document.getElementById('carritoItems');
    carritoLista.innerHTML = '';

    let total = 0;

    carritoItems.forEach((item, index) => {
        carritoLista.innerHTML += `
            <li>
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-img"> <!-- Mostrar imagen en el carrito -->
                ${item.nombre} - $${item.precio} 
                <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </li>`;
        total += item.precio;
    });

    const costoEnvio = 10;
    const totalFinal = total + costoEnvio;

    carritoLista.innerHTML += `<li><strong>Costo de Envío:</strong> $${costoEnvio.toFixed(2)}</li>`;
    carritoLista.innerHTML += `<li><strong>Total (con envío):</strong> $${totalFinal.toFixed(2)}</li>`;
}

function irFormularioPago() {
    window.location.href = '../html/pago.html';
}

function eliminarDelCarrito(index) {
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    carritoItems.splice(index, 1);
    localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
    actualizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('carritoItems');
    actualizarCarrito();
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarDatos();
        actualizarCarrito();
    } catch (error) {
        console.error("Error al inicializar la página:", error);
    }
});

function irFormularioPago() {
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    if (carritoItems.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No hay artículos en el carrito. Por favor, añade algunos productos antes de proceder a la compra.",
            confirmButtonText: 'Entendido'
        });
    } else {
        window.location.href = '../html/pago.html';
    }
}