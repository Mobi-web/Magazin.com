let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
let currentProduct = null;
let currentQuantity = 1;
let currentImageIndex = 0;
let chatMessages = [];
let startX = 0;
let isSwiping = false;
let searchIndex = -1;

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке товаров');
        }
        products = await response.json();
        displayProducts();
        displayRecommendedProducts();
        displayNewProducts();
        displaySaleProducts();
        displayPopularProducts();
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

function displayProducts(filteredProducts = products) {
    const productsDiv = document.getElementById("product-gallery");
    productsDiv.innerHTML = '';
    filteredProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <button class="wishlist-button" onclick="toggleWishlist(event, '${product.name}', ${product.price}, '${product.images[0]}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg></button>
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <div class="buttons">
                <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать 🛍️</button>
            </div>
        `;
        // Убедитесь, что клик по карточке товара не открывает модальное окно
        productDiv.querySelector('img').addEventListener('click', () => {
            openModal(products.indexOf(product));
            trackRecentlyViewed(product);
        });
        productsDiv.appendChild(productDiv);
    });
}

function displayRecommendedProducts() {
    const recommendedDiv = document.getElementById("recommended-products");
    recommendedDiv.innerHTML = '';
    const recommendedProducts = products.filter(product => product.isRecommended);
    recommendedProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <button class="wishlist-button" onclick="toggleWishlist(event, '${product.name}', ${product.price}, '${product.images[0]}')">❤️</button>
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <div class="buttons">
                <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            </div>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        recommendedDiv.appendChild(productDiv);
    });
}

function displayNewProducts() {
    const newProductsDiv = document.getElementById("new-products");
    newProductsDiv.innerHTML = '';
    const newProducts = products.filter(product => product.isNew);
    newProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <button class="wishlist-button" onclick="toggleWishlist(event, '${product.name}', ${product.price}, '${product.images[0]}')">❤️</button>
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <div class="buttons">
                <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            </div>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        newProductsDiv.appendChild(productDiv);
    });
}

function displaySaleProducts() {
    const saleProductsDiv = document.getElementById("sale-products");
    saleProductsDiv.innerHTML = '';
    const saleProducts = products.filter(product => product.isOnSale);
    saleProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <button class="wishlist-button" onclick="toggleWishlist(event, '${product.name}', ${product.price}, '${product.images[0]}')">❤️</button>
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <div class="buttons">
                <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            </div>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        saleProductsDiv.appendChild(productDiv);
    });
}

function displayPopularProducts() {
    const popularProductsDiv = document.getElementById("popular-products");
    popularProductsDiv.innerHTML = '';
    const popularProducts = products.filter(product => product.isPopular);
    popularProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <button class="wishlist-button" onclick="toggleWishlist(event, '${product.name}', ${product.price}, '${product.images[0]}')">❤️</button>
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <div class="buttons">
                <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            </div>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        popularProductsDiv.appendChild(productDiv);
    });
}

function displayCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onclick="openModalFromCart(${index})">
            <p>${item.name} - ${item.price}₽ x ${item.quantity}</p>
            <button class="btn" onclick="removeFromCart(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-720v520-520Zm170 600H280q-33 0-56.5-23.5T200-160v-520h-40v-80h200v-40h240v40h200v80h-40v172q-17-5-39.5-8.5T680-560v-160H280v520h132q6 21 16 41.5t22 38.5Zm-90-160h40q0-63 20-103.5l20-40.5v-216h-80v360Zm160-230q17-11 38.5-22t41.5-16v-92h-80v130ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm66-106 28-28-74-74v-112h-40v128l86 86Z"/></svg></button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
}

function openModalFromCart(index) {
    const cartItem = cart[index];
    const product = products.find(p => p.name === cartItem.name);
    if (product) {
        openModal(products.indexOf(product));
    }
}

function orderNow(name, image) {
    const message = `Я хочу заказать ${name} %0AИзображение: ${image}`;
    window.open(`https://wa.me/+79964684744?text=${encodeURIComponent(message)}`, '_blank');
}

function addToCart(name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity, image });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавлен в корзину 🛒!`);
    displayCart();
}

function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.name, currentProduct.price, currentProduct.images[0], currentQuantity);
        closeModal();
    }
}

function toggleWishlist(event, name, price, image) {
    event.preventDefault(); // Предотвратить открытие модального окна
    event.stopPropagation(); // Остановить всплытие события
    event.currentTarget.classList.toggle('active');
    const existingItem = wishlist.find(item => item.name === name);
    if (existingItem) {
        wishlist = wishlist.filter(item => item.name !== name);
    } else {
        wishlist.push({ name, price, image });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();
}

function displayWishlist() {
    const wishlistItemsDiv = document.getElementById("wishlist-items");
    wishlistItemsDiv.innerHTML = '';
    wishlist.forEach((item, index) => {
        const wishlistItemDiv = document.createElement("div");
        wishlistItemDiv.className = "cart-item";
        wishlistItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - ${item.price}₽</p>
            <button class="btn" onclick="toggleWishlist(event, '${item.name}', ${item.price}, '${item.image}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-720v520-520Zm170 600H280q-33 0-56.5-23.5T200-160v-520h-40v-80h200v-40h240v40h200v80h-40v172q-17-5-39.5-8.5T680-560v-160H280v520h132q6 21 16 41.5t22 38.5Zm-90-160h40q0-63 20-103.5l20-40.5v-216h-80v360Zm160-230q17-11 38.5-22t41.5-16v-92h-80v130ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm66-106 28-28-74-74v-112h-40v128l86 86Z"/></svg></button>
        `;
        wishlistItemsDiv.appendChild(wishlistItemDiv);
    });
}

function openModal(index) {
    currentProduct = products[index];
    currentQuantity = 1;
    currentImageIndex = 0;
    document.getElementById("modalProductName").innerText = currentProduct.name;
    const modalProductImages = document.getElementById("modalProductImages");
    modalProductImages.innerHTML = '';
    currentProduct.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = currentProduct.name;
        if (image === currentProduct.images[currentImageIndex]) {
            img.classList.add('active');
        }
        modalProductImages.appendChild(img);
    });
    document.getElementById("modalProductPrice").innerText = `Цена: ${currentProduct.price}₽`;
    document.getElementById("modalProductQuantity").innerText = currentQuantity;
    document.getElementById("productModal").style.display = "block";
    loadReviewsInModal(currentProduct.name);
    updateImageCount();

    const slider = document.getElementById("modalProductImages");
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);

    modalProductImages.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => openFullscreen(currentProduct.images, currentImageIndex));
    });
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    currentProduct = null;
    currentQuantity = 1;
    currentImageIndex = 0;
    searchIndex = -1;
}

function increaseQuantity() {
    currentQuantity++;
    document.getElementById("modalProductQuantity").innerText = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById("modalProductQuantity").innerText = currentQuantity;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();
}

function checkout() {
    if (cart.length > 0) {
        const cartItems = cart.map(item => `${item.name} - ${item.price}₽ x ${item.quantity} %0AИзображение: ${item.image}`).join('%0A');
        const message = `Я хочу заказать:%0A${cartItems}`;
        window.open(`https://t.me/+79964684744?text=${encodeURIComponent(message)}`, '_blank');
    } else {
        alert('Ваша корзина пуста');
    }
}

function filterProducts() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
    displayProducts(filteredProducts);
    searchIndex = filteredProducts.length > 0 ? 0 : -1;
}

loadProducts();
displayCart();
displayWishlist();
displayRecentlyViewed();

function toggleMenu() {
    const menuPanel = document.getElementById("menu-panel");
    menuPanel.style.display = menuPanel.style.display === "block" ? "none" : "block";
}

function showMain() {
    document.getElementById("product-gallery").style.display = "grid";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showRecommended() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "block";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showNewProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "block";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showSaleProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "block";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showPopularProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "block";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showCartSection() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "block";
    document.getElementById("wishlist-section").style.display = "none";
    toggleMenu();
}

function showWishlist() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("wishlist-section").style.display = "block";
    toggleMenu();
}

async function loadReviewsInModal(productName) {
    try {
        const response = await fetch('pleys.json');
        const reviews = await response.json();
        const productReviews = reviews[productName] || [];
        const reviewsDiv = document.getElementById('modalProductReviews');
        reviewsDiv.innerHTML = productReviews.map(review => `<p>${review}</p>`).join('');
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
    }
}

function nextImage() {
    const images = currentProduct.images;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImages();
    updateImageCount();
}

function prevImage() {
    const images = currentProduct.images;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalImages();
    updateImageCount();
}

function updateModalImages() {
    const modalProductImages = document.getElementById("modalProductImages");
    const imgs = modalProductImages.getElementsByTagName('img');
    Array.from(imgs).forEach(img => img.classList.remove('active'));
    if (imgs[currentImageIndex]) {
        imgs[currentImageIndex].classList.add('active');
    }
}

function updateImageCount() {
    const imageCount = document.querySelectorAll('.image-count');
    imageCount.forEach(count => {
        count.innerText = `${currentImageIndex + 1} / ${currentProduct.images.length}`;
    });
}

function openFullscreen(images, startIndex) {
    currentImageIndex = startIndex;
    const fullscreenImages = document.getElementById("fullscreenImages");
    fullscreenImages.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = currentProduct.name;
        if (index === currentImageIndex) {
            img.classList.add('active');
        }
        fullscreenImages.appendChild(img);
    });
    document.getElementById("fullscreen").style.display = "block";
    updateImageCount();

    const slider = document.getElementById("fullscreenImages");
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);
}

function closeFullscreen() {
    document.getElementById("fullscreen").style.display = "none";
}

function handleTouchStart(evt) {
    startX = evt.touches[0].clientX;
    isSwiping = true;
}

function handleTouchMove(evt) {
    if (!isSwiping) return;
    evt.preventDefault();
    const x = evt.touches[0].clientX;
    const walk = (x - startX) * 1;
    if (walk > 50) {
        prevImage();
        isSwiping = false;
    } else if (walk < -50) {
        nextImage();
        isSwiping = false;
    }
}

function handleTouchEnd() {
    isSwiping = false;
}

function openChat() {
    document.getElementById("chatContainer").style.display = "block";
    loadChatMessages();
}

function closeChat() {
    document.getElementById("chatContainer").style.display = "none";
}

function loadChatMessages() {
    const chatMessagesDiv = document.getElementById("chatMessages");
    chatMessagesDiv.innerHTML = chatMessages.map(message => `<div class="chat-message">${message}</div>`).join('');
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = document.getElementById('chatInput').value;
        if (message) {
            chatMessages.push(message);
            loadChatMessages();
            document.getElementById('chatInput').value = '';
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function openTelegramChat() {
    window.open('https://t.me/dtUsBXdlcvYxMmJi', '_blank');
}

function trackRecentlyViewed(product) {
    const existingItemIndex = recentlyViewed.findIndex(item => item.name === product.name);
    if (existingItemIndex !== -1) {
        recentlyViewed.splice(existingItemIndex, 1);
    }
    recentlyViewed.unshift(product);
    if (recentlyViewed.length > 5) {
        recentlyViewed.pop();
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    displayRecentlyViewed();
}

function displayRecentlyViewed() {
    const recentlyViewedItemsDiv = document.getElementById("recently-viewed-items");
    recentlyViewedItemsDiv.innerHTML = '';
    recentlyViewed.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
        `;
        recentlyViewedItemsDiv.appendChild(productDiv);
    });
}
