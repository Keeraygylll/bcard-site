document.querySelector('#contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Выводим ответ от сервера
        // Здесь вы можете добавить логику обработки успешной отправки
        // Например, перенаправление на index.html
        window.location.href = '/index.html'; // Поменяйте путь, если необходимо
    })
    .catch(error => {
        console.error('Ошибка:', error);
        // Здесь вы можете добавить логику обработки ошибок
    });
});
