window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`https://back-render-qgwc.onrender.com/users/me`, {
            credentials: 'include' // Включаем передачу куки
        });
        if (!response.ok) {
            document.getElementById('logout').textContent = 'Login';
            alert("Unauthorized");
        } else {
            // Получаем строку JSON из локального хранилища
            const data_current_user = sessionStorage.getItem('data_current_user');
            // Преобразуем строку JSON в объект JavaScript
            const userObject = JSON.parse(data_current_user);
            // Обращаемся к свойству id_user
            const user_id = userObject.id;
            // Получаем данные о заказах пользователя из API
            const ordersResponse = await fetch(`https://back-render-qgwc.onrender.com/orders/?id_user=${user_id}`);
            const ordersData = await ordersResponse.json();

            // Полученные данные обрабатываем и отображаем на странице
            const ordersContainer = document.getElementById('orders_container');
            ordersData.forEach(order => {
                // Создаем карточку заказа
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                // Создаем контейнер для Order Number и Date
                const orderDetailsContainer = document.createElement('div');
                orderDetailsContainer.classList.add('order-details');

                // Order Number
                const orderIdParagraph = document.createElement('p');
                orderIdParagraph.textContent = `Order Number: ${order.id}`;
                orderDetailsContainer.appendChild(orderIdParagraph);

                // Date
                const orderDate = new Date(order.timestamp);
                const formattedDate = orderDate.toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const orderDateParagraph = document.createElement('p');
                orderDateParagraph.textContent = `Date: ${formattedDate}`;
                orderDetailsContainer.appendChild(orderDateParagraph);

                // Добавляем контейнер с Order Number и Date к карточке заказа
                orderCard.appendChild(orderDetailsContainer);

                // Создаем таблицу для товаров
                const orderTable = document.createElement('table');
                orderTable.classList.add('order-table');

                // Создаем заголовок таблицы
                const tableHeader = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const nameHeader = document.createElement('th');
                nameHeader.textContent = 'Name';
                const priceHeader = document.createElement('th');
                priceHeader.textContent = 'Price';
                const quantityHeader = document.createElement('th');
                quantityHeader.textContent = 'Quantity';
                headerRow.appendChild(nameHeader);
                headerRow.appendChild(priceHeader);
                headerRow.appendChild(quantityHeader);
                tableHeader.appendChild(headerRow);
                orderTable.appendChild(tableHeader);

                // Создаем тело таблицы
                const tableBody = document.createElement('tbody');
                order.data_orders.forEach(item => {
                    const itemRow = document.createElement('tr');
                    const itemName = document.createElement('td');
                    itemName.textContent = item.name;
                    const itemPrice = document.createElement('td');
                    itemPrice.textContent = item.price;
                    const itemQuantity = document.createElement('td');
                    itemQuantity.textContent = item.quantity;
                    itemRow.appendChild(itemName);
                    itemRow.appendChild(itemPrice);
                    itemRow.appendChild(itemQuantity);
                    tableBody.appendChild(itemRow);
                });
                orderTable.appendChild(tableBody);

                // Добавляем таблицу к карточке заказа
                orderCard.appendChild(orderTable);

                // Создаем контейнер для Delivery Status и Total
                const statusTotalContainer = document.createElement('div');
                statusTotalContainer.classList.add('order-details');

                // Delivery Status
                const deliveryStatusParagraph = document.createElement('p');
                deliveryStatusParagraph.textContent = 'Delivery Status: Delivered';
                statusTotalContainer.appendChild(deliveryStatusParagraph);

                // Total
                const totalAmount = order.data_orders.reduce((total, item) => total + (item.price * item.quantity), 0);
                const totalParagraph = document.createElement('p');
                totalParagraph.textContent = `Total: ${totalAmount}`;
                statusTotalContainer.appendChild(totalParagraph);

                // Добавляем контейнер с Delivery Status и Total к карточке заказа
                orderCard.appendChild(statusTotalContainer);

                // Добавляем карточку заказа в контейнер
                ordersContainer.appendChild(orderCard);
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});
