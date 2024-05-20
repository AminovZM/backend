document.getElementById('search_button').addEventListener('click', async () => {
    //window.location.href = 'search.html'; // Перенаправление на другую страницу в той же директории

    const searchInputValue = document.getElementById('search_input').value;
    try {
        const response = await fetch(`https://back-render-qgwc.onrender.com/products/name?product_name=${searchInputValue}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        // Обработка полученных данных
        const data = await response.json();
        const productsContainer = document.getElementById('products_container');
        productsContainer.innerHTML = '';

        if (data.length > 0) {
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Цена: ${product.price}</p>
                    <p>Остатки: ${product.remainder}</p>
                    <p>id: ${product.id}</p>
                    <div class="add_to_cart">
                        <button onclick="decrementQuantity(${product.id})">-</button>
                        <span id="quantity_${product.id}">0</span>
                        <button onclick="incrementQuantity(${product.id})">+</button>
                        <button onclick="addToCart(${product.id})">Добавить в корзину</button> <!-- Убрано quantity -->
                    </div>
                `;
                productsContainer.appendChild(productCard);
            });
        } else {
            productsContainer.innerHTML = '<p>Товары отсутствуют</p>';
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});
