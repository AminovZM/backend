async function addToCart(productId) {
    try {
        // Получаем данные о текущем пользователе из sessionStorage
        const data_current_user = sessionStorage.getItem('data_current_user');
        // Преобразуем строку JSON в объект JavaScript
        const userObject = JSON.parse(data_current_user);
        // Обращаемся к свойству id_user
        const user_id = userObject.id;

        const data = { id: productId, quantity: quantities[productId], id_user: user_id }; // Используем текущее количество товара из объекта quantities
        
        const response = await fetch('https://front-end-l0jy.onrender.com/baskets/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Ошибка при добавлении товара в корзину');
        }

        const responseData = await response.json();
        console.log('Товар успешно добавлен в корзину:', responseData);
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

async function getProducts(category) {
    try {
        const response = await fetch(`https://front-end-l0jy.onrender.com/products/?product_category=${category}`);
        if (!response.ok) {
            throw new Error('Ошибка получения данных от сервера');
        }
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
                        <button onclick="addToCart(${product.id})">Add to basket</button> <!-- Убрано quantity -->
                    </div>
                `;
                productsContainer.appendChild(productCard);
            });
        } else {
            productsContainer.innerHTML = '<p>No products available</p>';
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

const quantities = {};

function incrementQuantity(productId) {
    if (!quantities[productId]) {
        quantities[productId] = 0;
    }
    quantities[productId]++;
    updateQuantityDisplay(productId);
}

function decrementQuantity(productId) {
    if (!quantities[productId]) {
        return;
    }
    if (quantities[productId] > 0) {
        quantities[productId]--;
        updateQuantityDisplay(productId);
    }
}

function updateQuantityDisplay(productId) {
    const quantityDisplay = document.getElementById(`quantity_${productId}`);
    if (quantityDisplay) {
        quantityDisplay.innerText = quantities[productId];
    }
}

// Вызываем функцию getProducts(category) после ее определения
getProducts('beverages');


async function get_user() {
    try {
        const response = await fetch('https://front-end-l0jy.onrender.com/users/me', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            },
            credentials: 'include' // Включаем передачу куки
        });
        
        if (!response.ok) {
            document.getElementById('current_user').textContent = 'Unauthorized';
            // Изменяем текст кнопки на "Login"
            document.getElementById('logout').textContent = 'Login';
            throw new Error('Ошибка получения данных от сервера');
        }
        const data = await response.json();
        document.getElementById('current_user').textContent = data.username;

        //localStorage.setItem('data_current_user', JSON.stringify(data));
        sessionStorage.setItem('data_current_user', JSON.stringify(data));

        // Изменяем текст кнопки на "Logout"
        document.getElementById('logout').textContent = 'Logout';

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

get_user();
//setTimeout(get_user, 5000);