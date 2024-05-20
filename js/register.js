document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    try {
        const formData = {
            email: email,
            password: password,
            is_active: false,
            is_superuser: false,
            is_verified: false,
            username: username,
        };
        
        const response = await fetch('https://back-render-qgwc.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        

        const responseData = await response.json();

        if (response.ok) {
            // Если запрос успешен, отобразите полученные данные
            //document.getElementById('response').textContent = `Имя пользователя: ${data.username}, День рождения: ${data.birthdate}`;
            document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
            window.location.href = '../login.html'; // Перенаправление на другую страницу в той же директории
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
