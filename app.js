// Cargar productos desde localStorage si existen, o usar los productos predeterminados
let productosDisponibles = JSON.parse(localStorage.getItem('productosDisponibles')) || [
    { id: 1, nombre: 'Laptop usada', precio: 300 },
    { id: 2, nombre: 'Celular usado', precio: 150 },
    { id: 3, nombre: 'Cámara digital usada', precio: 100 },
    { id: 4, nombre: 'Bicicleta usada', precio: 80 }
];

let productosComprados = JSON.parse(localStorage.getItem('productosComprados')) || [];
let saldo = 500;  // Saldo inicial del usuario

// Función para mostrar los productos disponibles para comprar
function mostrarProductos() {
    const divProductosDisponibles = document.getElementById('productosDisponibles');
    divProductosDisponibles.innerHTML = '<h2>Productos disponibles para comprar:</h2><ul>';

    productosDisponibles.forEach(producto => {
        divProductosDisponibles.innerHTML += `<li>${producto.id}. ${producto.nombre} - $${producto.precio}</li>`;
    });

    divProductosDisponibles.innerHTML += '</ul>';
}

// Función para mostrar los productos que se pueden vender
function mostrarProductosParaVender() {
    const divProductosParaVender = document.getElementById('productosParaVender');
    divProductosParaVender.innerHTML = '<h2>Productos disponibles para vender:</h2><ul>';

    productosComprados.forEach(producto => {
        divProductosParaVender.innerHTML += `<li>${producto.id}. ${producto.nombre} - $${producto.precio}</li>`;
    });

    divProductosParaVender.innerHTML += '</ul>';
}

// Función para comprar un producto
function comprarProducto() {
    let productoId = prompt('¿Qué producto deseas comprar? Ingresa el número del producto (1-4):');
    productoId = parseInt(productoId);

    // Validar si el producto es válido
    if (productoId < 1 || productoId > productosDisponibles.length || isNaN(productoId)) {
        alert('Producto no válido.');
        return;
    }

    const producto = productosDisponibles.find(item => item.id === productoId);

    if (producto) {
        // Verificar si el usuario tiene suficiente saldo
        if (saldo >= producto.precio) {
            const confirmarCompra = confirm(`¿Estás seguro que deseas comprar ${producto.nombre} por $${producto.precio}?`);

            if (confirmarCompra) {
                saldo -= producto.precio;
                productosComprados.push(producto);
                alert(`Compra realizada con éxito. Te quedan $${saldo} en tu cuenta.`);
                verSaldoYProductos(); // Actualiza el saldo y productos
                mostrarProductosParaVender(); // Muestra el producto en la lista de productos para vender
                actualizarLocalStorage(); // Guarda los cambios en localStorage
            } else {
                alert('Compra cancelada.');
            }
        } else {
            alert('No tienes suficiente saldo para comprar este producto.');
        }
    }
}

// Función para vender un producto
function venderProducto() {
    let productoId = prompt('¿Qué producto deseas vender? Ingresa el número del producto que vas a vender:');
    productoId = parseInt(productoId);

    // Validar si el producto es válido
    if (productoId < 1 || productoId > productosComprados.length || isNaN(productoId)) {
        alert('Producto no válido.');
        return;
    }

    const producto = productosComprados.find(item => item.id === productoId);

    if (producto) {
        const precioVenta = prompt(`¿Por cuánto deseas vender ${producto.nombre}?`);

        if (isNaN(precioVenta) || parseInt(precioVenta) <= 0) {
            alert('Precio no válido.');
            return;
        }

        saldo += parseInt(precioVenta);
        const index = productosComprados.indexOf(producto);
        productosComprados.splice(index, 1); // Elimina el producto de la lista de productos comprados
        alert(`Producto vendido. Te quedan $${saldo} en tu cuenta.`);
        verSaldoYProductos(); // Actualiza el saldo y productos
        mostrarProductosParaVender(); // Actualiza la lista de productos para vender
        actualizarLocalStorage(); // Guarda los cambios en localStorage
    } else {
        alert('No tienes este producto en tu inventario.');
    }
}

// Función para mostrar el saldo actual y productos comprados
function verSaldoYProductos() {
    const divSaldo = document.getElementById('saldo');
    divSaldo.innerHTML = `<h3>Tu saldo actual es: $${saldo}</h3>`;

    const divProductosComprados = document.getElementById('productosComprados');
    divProductosComprados.innerHTML = '<h2>Productos que has comprado:</h2><ul>';

    if (productosComprados.length > 0) {
        productosComprados.forEach(producto => {
            divProductosComprados.innerHTML += `<li>${producto.nombre} - $${producto.precio}</li>`;
        });
    } else {
        divProductosComprados.innerHTML += '<li>No tienes productos comprados.</li>';
    }
}

// Función para crear un nuevo producto
function crearProducto() {
    const nombreProducto = prompt('Ingresa el nombre del nuevo producto:');
    const precioProducto = prompt('Ingresa el precio del nuevo producto:');

    // Validar el precio
    if (isNaN(precioProducto) || parseInt(precioProducto) <= 0) {
        alert('Precio no válido.');
        return;
    }

    // Crear el nuevo producto
    const nuevoProducto = {
        id: productosDisponibles.length + 1, // Asignar un ID basado en la longitud del array
        nombre: nombreProducto,
        precio: parseInt(precioProducto)
    };

    // Agregar el nuevo producto a productosDisponibles
    productosDisponibles.push(nuevoProducto);
    alert(`Producto "${nuevoProducto.nombre}" agregado correctamente a la lista.`);

    // Actualizar la lista de productos disponibles
    mostrarProductos(); // Actualiza la lista de productos disponibles para compra

    // Guardar en el localStorage
    actualizarLocalStorage(); // Guarda los productos en localStorage
}

// Función para actualizar el localStorage
function actualizarLocalStorage() {
    localStorage.setItem('productosDisponibles', JSON.stringify(productosDisponibles));
    localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
}

// Función para salir
function salir() {
    alert('¡Hasta luego!');
    window.location.reload();  // Recarga la página para resetear la aplicación
}

// Inicializar la página
mostrarProductos();
mostrarProductosParaVender();
verSaldoYProductos();
