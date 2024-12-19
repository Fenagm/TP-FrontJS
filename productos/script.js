// Obtener elementos del carrito
const cartButton = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cart = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const clearCartButton = document.getElementById('clear-cart');
const productGridContainer = document.querySelector('.productos-grid');

// Crear el botón de finalizar compra
const finalizePurchaseButton = document.createElement('button');
finalizePurchaseButton.textContent = 'Finalizar Compra';
finalizePurchaseButton.classList.add('btn', 'btn-success', 'cart-action-button');
cart.appendChild(finalizePurchaseButton);

// Crear el contenedor del total a pagar
const totalPriceContainer = document.createElement('div');
totalPriceContainer.classList.add('total-price-container');
totalPriceContainer.textContent = 'Total: $0';
cart.appendChild(totalPriceContainer);

// Aplicar estilos al contenedor del carrito
cartItems.style.maxHeight = '300px';
cartItems.style.overflowY = 'auto';
cartItems.style.border = '1px solid #ccc';
cartItems.style.padding = '10px';
cartItems.style.marginBottom = '10px';

// Estilos adicionales para botones y contenedores
const style = document.createElement('style');
style.textContent = `
  .cart-action-button {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
  }
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .total-price-container {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    text-align: right;
  }
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .cart-item-details {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .cart-item-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;
document.head.appendChild(style);

// Almacenar productos en el carrito (utilizando localStorage)
let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

// Actualizar el contador del carrito
function updateCartCount() {
  const totalItems = cartData.reduce((sum, product) => sum + product.quantity, 0);
  cartCount.textContent = totalItems;
}

// Actualizar el total a pagar
function updateTotalPrice() {
  const totalPrice = cartData.reduce((sum, product) => sum + product.price * product.quantity, 0);
  totalPriceContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Mostrar los productos en el carrito
function displayCartItems() {
  cartItems.innerHTML = ''; // Limpiar la vista actual

  if (cartData.length === 0) {
    cartItems.innerHTML = '<p>No hay productos en el carrito.</p>';
    updateTotalPrice();
    updateCartCount();
    return;
  }

  cartData.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('cart-item');
    productElement.innerHTML = `
      <div class="cart-item-details">
        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px;">
        <div>
          <h3>${product.name}</h3>
          <p>Precio: $${product.price}</p>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="btn btn-secondary btn-sm decreasequantity" data-id="${product.id}">-</button>
          <span>${product.quantity}</span>
          <button class="btn btn-secondary btn-sm increasequantity" data-id="${product.id}">+</button>
        </div>
        <button class="btn btn-danger btn-sm remove-item" data-id="${product.id}">Eliminar</button>
      </div>
    `;
    cartItems.appendChild(productElement);
  });

  addCartItemEventListeners(); // Actualizar eventos
  updateTotalPrice();
  updateCartCount();
}

// Añadir un producto al carrito
function addToCart(id, name, price, image) {
  const existingProduct = cartData.find(product => product.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartData.push({
      id,
      name,
      price,
      image,
      quantity: 1
    });
  }

  updateCartData();
  displayCartItems();
}

// Incrementar cantidad
function increaseQuantity(id) {
  const product = cartData.find(item => item.id === parseInt(id, 10));
  if (product) {
    product.quantity += 1;
    updateCartData();
    displayCartItems();
  }
}

// Decrementar cantidad
function decreaseQuantity(id) {
  const product = cartData.find(item => item.id === parseInt(id, 10));
  if (product) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      removeFromCart(id);
      return;
    }
    updateCartData();
    displayCartItems();
  }
}

// Eliminar un producto del carrito
function removeFromCart(id) {
  cartData = cartData.filter(product => product.id !== parseInt(id, 10));
  updateCartData();
  displayCartItems();
}

// Vaciar el carrito
function clearCart() {
  cartData = [];
  updateCartData();
  displayCartItems();
}

// Finalizar la compra
function finalizePurchase() {
  if (cartData.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  alert('Gracias por tu compra. ¡Tu pedido ha sido procesado!');
  clearCart();
}

// Actualizar datos del carrito en localStorage
function updateCartData() {
  localStorage.setItem('cartData', JSON.stringify(cartData));
  updateCartCount();
}

function addCartItemEventListeners() {
    // Listener para eliminar productos
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation(); // Evitar cerrar el carrito
        removeFromCart(event.target.getAttribute('data-id'));
      });
    });
  
    // Listener para aumentar cantidad
    document.querySelectorAll('.increasequantity').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation(); // Evitar cerrar el carrito
        increaseQuantity(event.target.getAttribute('data-id'));
      });
    });
  
    // Listener para disminuir cantidad
    document.querySelectorAll('.decreasequantity').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation(); // Evitar cerrar el carrito
        decreaseQuantity(event.target.getAttribute('data-id'));
      });
    });
  }

// Evento para abrir/cerrar carrito
cartButton.addEventListener('click', () => {
  cart.style.display = cart.style.display === 'none' ? 'block' : 'none';
});

// Evento para cerrar carrito al hacer clic fuera
document.addEventListener('click', event => {
  if (!cart.contains(event.target) && event.target !== cartButton) {
    cart.style.display = 'none';
  }
});

// Evento para vaciar carrito
clearCartButton.addEventListener('click', clearCart);

// Evento para finalizar compra
finalizePurchaseButton.addEventListener('click', finalizePurchase);

// Fetch y renderizado de productos
async function fetchAndRenderProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products/category/electronics');
    const products = await response.json();

    if (productGridContainer) {
      productGridContainer.innerHTML = '';

      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('producto-grid');
        productElement.innerHTML = `
          <a href="/productos/productosdetalle.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
          </a>
          <div class="precio">$${product.price}</div>
          <button class="btn btn-primary add-to-cart" 
            data-id="${product.id}" 
            data-name="${product.title}" 
            data-price="${product.price}" 
            data-image="${product.image}">
            Añadir al carrito
          </button>
        `;

        productElement.querySelector('.add-to-cart').addEventListener('click', () => {
          addToCart(product.id, product.title, product.price, product.image);
        });

        productGridContainer.appendChild(productElement);
      });
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  displayCartItems();
  fetchAndRenderProducts();
});
