document.getElementById('logout').addEventListener('click', async function(event) {
    try {
        const response = await fetch('https://front-end-l0jy.onrender.com/auth/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include' // Включаем передачу куки
        });

        if (response.ok) {
            console.assert("Good");
        } else {
            console.error('Ошибка при выходе:', response.statusText);
            // Дополнительная обработка ошибки, если необходимо
        }
        window.location.href = 'login.html'; // Перенаправление на страницу входа
    } catch (error) {
        console.error('Ошибка при выходе:', error.message);
        // Дополнительная обработка ошибки, если необходимо
    }
});
