
// 'https://back-render-qgwc.onrender.com/auth/login'

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const formData = new URLSearchParams();
        formData.append('grant_type', '');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('scope', '');
        formData.append('client_id', 1);
        formData.append('client_secret', 1);

        const response = await fetch('https://back-render-qgwc.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json' // Добавляем заголовок accept
            },
            body: formData,
            credentials: 'include' // Включаем передачу куки
        });

        if (response.ok) {
            // Отправьте второй запрос с этими куками
            const response2 = await fetch('https://back-render-qgwc.onrender.com/current_user', {
                method: 'POST',
                headers: {
                    //'Cookie': bondsCookie,
                    'accept': 'application/json'
                },
                credentials: 'include' // Включаем передачу куки
            });

            const data2 = await response2.json();
            
            if (response2.ok) {
                console.log(data2);
                alert("good");
                // Если второй запрос успешен, отобразите успешное сообщение
                document.getElementById('response').textContent = 'Вы вошли в систему\nstatus code ' + response.status;
                window.location.href = '../index.html'; // Перенаправление на другую страницу в той же директории
            } else {
                // Если второй запрос вернул ошибку, отобразите сообщение об ошибке
                alert("error");
            }

        } else {
            // Если запрос вернул ошибку, отобразите сообщение об ошибке
            document.getElementById('response').textContent = 'Ошибка: Пароль или логин неверны';
        }
    } catch (error) {
        // Если произошла ошибка при выполнении запроса, отобразите сообщение об ошибке
        console.error('Ошибка:', error);
        document.getElementById('response').textContent = 'Ошибка при отправке запроса';
    }
});
