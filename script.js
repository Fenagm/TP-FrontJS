document.addEventListener("DOMContentLoaded", function() {
    const carouselContainer = document.querySelector(".carousel-container");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    
    let currentIndex = 0; // Track the current visible item
    let products = []; // Array to hold the products fetched from the API

    // Fetch products from the API
    fetch('https://fakestoreapi.com/products/category/electronics?limit=5')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(); // Render the fetched products
        })
        .catch(error => console.error("Error fetching products:", error));

    // Function to render the products
    function renderProducts() {
        // Clear previous products
        carouselContainer.innerHTML = '';

       // Create and append the product cards
products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('card');
    
    // Obtener descripción corta y completa
    const shortDescription = product.description.length > 100 
        ? product.description.substring(0, 100) + '...' 
        : product.description;
    
    productElement.innerHTML = `
        <a href="productos/productosdetalle.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
        </a>
        <p class="short-description">${shortDescription}</p>
        ${product.description.length > 100 ? `
            <button class="ver-mas producto-grid">Ver más</button>
            <p class="full-description" style="display: none;">${product.description}</p>
        ` : ''}
    `;
    
    // Añadir funcionalidad al botón
    const verMasButton = productElement.querySelector('.ver-mas');
    const shortDescElement = productElement.querySelector('.short-description');
    const fullDescElement = productElement.querySelector('.full-description');
    
    if (verMasButton) {
        verMasButton.addEventListener('click', () => {
            if (fullDescElement.style.display === 'none') {
                shortDescElement.style.display = 'none';
                fullDescElement.style.display = 'block';
                verMasButton.textContent = 'Ver menos';
            } else {
                shortDescElement.style.display = 'block';
                fullDescElement.style.display = 'none';
                verMasButton.textContent = 'Ver más';
            }
        });
    }
    
    carouselContainer.appendChild(productElement);
});

        // Adjust the carousel width based on the number of products
        updateCarousel();
    }

    // Function to update carousel width based on the number of items
    function updateCarousel() {
        const cardWidth = document.querySelector('.card').offsetWidth;
        const totalWidth = cardWidth * products.length;
        carouselContainer.style.width = `${totalWidth}px`;
    }

    // Function to show the next item
    function showNext() {
        if (currentIndex < products.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to the first item
        }
        updateCarouselPosition();
    }

    // Function to show the previous item
    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = products.length - 1; // Loop back to the last item
        }
        updateCarouselPosition();
    }

    // Function to update the position of the carousel
    function updateCarouselPosition() {
        const cardWidth = document.querySelector('.card').offsetWidth;
        const offset = -(cardWidth * currentIndex);
        carouselContainer.style.transform = `translateX(${offset}px)`;
    }

    // Event listeners for the navigation buttons
    prevButton.addEventListener("click", showPrev);
    nextButton.addEventListener("click", showNext);
});
