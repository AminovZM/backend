

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`https://aminov-test.onrender.com/users/me`, {
            credentials: 'include' // Включаем передачу куки
        });
        if (!response.ok) {
            document.getElementById('logout').textContent = 'Login';
            alert("Unauthorized");
        } else{
            // Получаем строку JSON из локального хранилища
            const data_current_user = sessionStorage.getItem('data_current_user');
            // Преобразуем строку JSON в объект JavaScript
            const userObject = JSON.parse(data_current_user);
            // Обращаемся к свойству id_user
            const user_id = userObject.id;

            // Получаем данные о корзине из API
            const basketResponse = await fetch(`https://aminov-test.onrender.com/baskets/?id_user=${user_id}`);
            let basketData = await basketResponse.json();

            // Создаем массив для хранения промисов получения данных о продуктах
            const productPromises = basketData.map(async (item) => {
                const productId = item.id;
                const productResponse = await fetch(`https://aminov-test.onrender.com/products/id?product_id=${productId}`);
                const productData = await productResponse.json();
                return { ...item, ...productData[0] }; // Добавляем данные о продукте к элементу корзины
            });

            // Ожидаем завершения всех промисов
            basketData = await Promise.all(productPromises);
            
            const response = await fetch(`https://aminov-test.onrender.com/users/me`, {
                credentials: 'include' // Включаем передачу куки
            });

            // Отображаем товары из корзины
            const basketItemsElement = document.getElementById('basket_items');
            let totalAmount = 0; // Переменная для хранения общей суммы
            for (let i = 0; i < basketData.length; i++) {
                const productId = basketData[i].id;
                const productData = basketData[i]; // Данные о продукте для текущего элемента

                // Создаем элемент для отображения товара
                const productElement = document.createElement('div');
                productElement.classList.add('basket_item'); // Добавляем класс для стилизации
                totalAmount += basketData[i].quantity * basketData[i].price; // Добавляем сумму текущего товара к общей сумме
                productElement.innerHTML = `
                    <div class="basket_item_info">
                        <p>ID: ${productId}</p>
                        <p>Name: ${productData.name}</p>
                        <p>Price: ${productData.price}</p>
                        <p>Quantity: ${productData.quantity}</p>
                    </div>
                `;

                // Создаем кнопку "Удалить" для товара
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.id = 'btn_del'; // Добавляем id
                deleteButton.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`https://aminov-test.onrender.com/baskets/${user_id}/${productId}`, {
                            method: 'DELETE',
                            headers: {
                                'accept': 'application/json'
                            }
                        });
                        if (response.ok) {
                            // Обновляем страницу после успешного удаления
                            location.reload();
                        } else {
                            console.error('Failed to delete product from basket');
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                    }
                });

                // Добавляем кнопку "Удалить" к элементу товара
                productElement.appendChild(deleteButton);

                basketItemsElement.appendChild(productElement);
            }

            // Создаем элемент для отображения общей суммы
            const totalAmountElement = document.createElement('div');
            totalAmountElement.id = 'total_amount'; // Добавляем id
            totalAmountElement.textContent = `Total Amount: ${totalAmount}`;

            // Создаем кнопку "Сделать заказ"
            const makeOrderButton = document.createElement('button');
            makeOrderButton.id = 'make_order_button'; // Добавляем id
            makeOrderButton.textContent = 'Make Order';
            makeOrderButton.addEventListener('click', () => {
                // Вызываем функцию для создания заказа
                if (basketData.length > 0) {
                    // Вызываем функцию для создания заказа
                    createOrder(user_id, basketData);
                } else {
                    alert('Your basket is empty. Add some items before making an order.');
                }
            });

            // Создаем div для общей суммы и кнопки "Сделать заказ"
            const sumDiv = document.createElement('div');
            sumDiv.id = 'sum_div';
            sumDiv.appendChild(totalAmountElement);
            sumDiv.appendChild(makeOrderButton);

            // Вставляем div с общей суммой и кнопкой "Сделать заказ" после корзины
            basketItemsElement.insertAdjacentElement('afterend', sumDiv);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});


// Функция для создания заказа
async function createOrder(user_id, basketData) {
    try {
        // Создаем массив для хранения заказов
        const orders = [];

        // Собираем данные о продуктах из корзины и подготавливаем их в виде словаря
        for (let i = 0; i < basketData.length; i++) {
            const productId = basketData[i].id;
            const order = {
                id: productId,
                name: basketData[i].name,
                price: basketData[i].price,
                quantity: basketData[i].quantity
            };
            orders.push(order);
        }

        // Отправляем запрос POST на API
        const response = await fetch('https://aminov-test.onrender.com/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data_orders: orders,
                id_user: user_id,
                timestamp: new Date().toISOString().replace('T', ' ').replace('Z', '')
            })
        });

        // Проверяем успешность запроса
        if (response.ok) {
            console.log('Order placed successfully!');
            
            fetch(`https://aminov-test.onrender.com/baskets/?id_user=${user_id}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json'
                },
            });
            location.reload();
            //curl -X 'DELETE' \
            //'http://127.0.0.1:8000/baskets/?id_user=44' \
            //-H 'accept: application/json'
            
            // Опционально: обновляем интерфейс или выполняем другие действия после успешного создания заказа
        } else {
            console.error('Failed to place order');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

