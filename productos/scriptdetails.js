// Obtener la URL actual
const currentURL = window.location.href;

// Crear un objeto URL para trabajar con los parámetros
const url = new URL(currentURL);

// Obtener el parámetro "id" de la URL
const id = url.searchParams.get("id");

// Mostrar el ID en la consola
console.log("El ID es:", id);

// Si se encontró un ID, proceder con la carga del producto
if (id) {
    console.log(`Procesando el ID: ${id}`);
    fetchAndRenderProduct(id); // Llamar a la función para cargar el producto
} else {
    console.log("No se encontró un ID en la URL.");
}

// Función para obtener y mostrar el detalle del producto
async function fetchAndRenderProduct(id) {
    try {
        // Primero ocultamos la vista de carga y mostramos el producto
        const productDetailContainer = document.querySelector('.producto-detalle');
        const specificationsContainer = document.querySelector('.producto-especificaciones');

        // Mostrar los contenedores después de que se cargue el contenido
        productDetailContainer.classList.remove('loading');
        specificationsContainer.classList.remove('loading');

        // Realizamos la llamada a la API para obtener el producto
        const response = await fetch('https://fakestoreapi.com/products/' + id);
        const product = await response.json();

        // Rellenar los datos del producto en la sección de detalle
        productDetailContainer.innerHTML = `
            <img src="${product.image}" alt="Imagen del Producto" class="producto-detalle-imagen">
            <div class="producto-detalle-info">
                <h2 class="producto-detalle-nombre">${product.title}</h2>
                <p class="producto-detalle-descripcion">${product.description}</p>
                <p class="producto-detalle-precio">$${product.price}</p>
                <button class="btn btn-primary add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.title}" 
                        data-price="${product.price}" 
                        data-image="${product.image}">
                    Añadir al carrito
                </button>
            </div>
        `;

        // Añadir el producto al carrito
        const addToCartButton = productDetailContainer.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => {
            addToCart(product.id, product.title, product.price, product.image);
        });

        

        // Rellenar los detalles y especificaciones del producto
        specificationsContainer.innerHTML = `
            <h3 class="especificaciones-titulo">Detalles y Especificaciones</h3>
            <ul class="especificaciones-lista">
                <li><strong>Marca:</strong> ${product.brand || 'No disponible'}</li>
                <li><strong>Modelo:</strong> ${product.model || 'No disponible'}</li>
                <li><strong>Procesador:</strong> ${product.processor || 'No disponible'}</li>
                <li><strong>Memoria RAM:</strong> ${product.ram || 'No disponible'}</li>
                <li><strong>Almacenamiento:</strong> ${product.storage || 'No disponible'}</li>
                <li><strong>Pantalla:</strong> ${product.screen || 'No disponible'}</li>
                <li><strong>Sistema Operativo:</strong> ${product.operatingSystem || 'No disponible'}</li>
                <li><strong>Conectividad:</strong> ${product.connectivity || 'No disponible'}</li>
            </ul>
        `;

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        const productDetailContainer = document.querySelector('.producto-detalle');
        const specificationsContainer = document.querySelector('.producto-especificaciones');
        productDetailContainer.innerHTML = "<p>Ocurrió un error al cargar el producto.</p>";
        specificationsContainer.innerHTML = "<p>Ocurrió un error al cargar las especificaciones.</p>";
    }
}


// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();  // Mostrar los productos en el carrito en la carga inicial
    
});
