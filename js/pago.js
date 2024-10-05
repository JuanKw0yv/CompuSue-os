document.addEventListener('DOMContentLoaded', () => {
    mostrarResumenCompra();
});

function mostrarResumenCompra() {
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || [];
    const resumenCompra = document.getElementById('resumenCompra');
    const costoTotal = document.getElementById('costoTotal');

    if (!resumenCompra || !costoTotal) {
        console.error('Elementos de resumenCompra o costoTotal no encontrados.');
        return;
    }

    const mensajeCarritoVacio = carritoItems.length === 0
        ? '<li>No hay artículos en el carrito.</li>'
        : carritoItems.map(({ nombre, precio, imagen }) => {
            return `
                <li>
                    <img src="../img/${imagen}" alt="${nombre}" class="resumen-img"> 
                    ${nombre} - $${precio.toFixed(2)}
                </li>`;
        }).join('');

    resumenCompra.innerHTML = mensajeCarritoVacio;

    const total = carritoItems.reduce((acc, { precio }) => acc + precio, 0);
    const costoEnvio = 10;
    const totalFinal = total + costoEnvio;

    costoTotal.innerHTML = `<strong>Costo Total (incluyendo envío):</strong> $${totalFinal.toFixed(2)}`;
}

document.getElementById('formPago').addEventListener('submit', function(e) {
    e.preventDefault();

    const { value: nombre } = document.getElementById('nombre');
    const { value: apellido } = document.getElementById('apellido');
    const { value: fechaNacimiento } = document.getElementById('fechaNacimiento');
    const { value: gmail } = document.getElementById('gmail');
    const { value: numero } = document.getElementById('numero');
    const { value: fecha } = document.getElementById('fecha');
    const { value: cvv } = document.getElementById('cvv');
    const mensajeError = document.getElementById('mensajeError');

    mensajeError.textContent = '';

    const camposVacios = !nombre || !apellido || !fechaNacimiento || !gmail || !numero || !fecha || !cvv;
    if (camposVacios) {
        mensajeError.textContent = 'Todos los campos son obligatorios.';
        return;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(gmail)) {
        mensajeError.textContent = 'Por favor, ingresa una dirección de Gmail válida.';
        return;
    }

    const longitudNumero = numero.length === 16;
    if (!longitudNumero) {
        mensajeError.textContent = 'El número de tarjeta debe tener 16 dígitos.';
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(fecha)) {
        mensajeError.textContent = 'El formato de la fecha debe ser MM/AA.';
        return;
    }

    const longitudCvv = cvv.length >= 3 && cvv.length <= 4;
    if (!longitudCvv) {
        mensajeError.textContent = 'El CVV debe tener entre 3 y 4 dígitos.';
        return;
    }

    Swal.fire({
        title: "Pago realizado",
        text: "Muchas gracias por confiar en nosotros.",
        icon: "success"
    }).then(() => {
        localStorage.removeItem('carritoItems');
        window.location.href = '../index.html';
    });
});

document.getElementById('fecha').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
        value = value.slice(0, 4);
    }
    value = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    e.target.value = value;
});