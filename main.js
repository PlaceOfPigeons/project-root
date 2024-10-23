// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyAWwSObNeCTqDk8xJg9sa0u4wIvk5JFw8E",
    authDomain: "placeofpigeons.firebaseapp.com",
    projectId: "placeofpigeons",
    storageBucket: "placeofpigeons.appspot.com",
    messagingSenderId: "67354529384",
    appId: "1:67354529384:web:716cf99397eb9002c435dd",
    measurementId: "G-P70KRENL94"
  };

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Получение имени пользователя из Telegram
window.Telegram.WebApp.ready();
const user = window.Telegram.WebApp.initDataUnsafe.user;
document.getElementById('username').textContent = user ? user.first_name : 'Гость';

// Генерация кода и сохранение в Firebase
const generateCodeBtn = document.getElementById('generate-code');
generateCodeBtn.addEventListener('click', () => {
    const inviteCode = Math.random().toString(36).substring(2, 8);
    document.getElementById('invite-code').textContent = inviteCode;

    const userId = user.id;
    firebase.database().ref('invites/' + inviteCode).set({
        userId: userId,
        username: user.first_name,
        invited: []
    });
});

// Отправка кода и сохранение того, кто ввел код
const submitCodeBtn = document.getElementById('submit-code');
submitCodeBtn.addEventListener('click', () => {
    const inputCode = document.getElementById('input-code').value;

    firebase.database().ref('invites/' + inputCode).once('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const userId = user.id;

            // Добавление нового пользователя в список
            const updates = {};
            updates['/invites/' + inputCode + '/invited/' + userId] = user.first_name;
            firebase.database().ref().update(updates);

            // Обновление списка приглашенных пользователей на странице
            updateInvitedUsers(inputCode);
        } else {
            alert('Неправильный код!');
        }
    });
});

// Обновление списка приглашенных пользователей
function updateInvitedUsers(inviteCode) {
    firebase.database().ref('invites/' + inviteCode + '/invited').on('value', (snapshot) => {
        const invitedUsers = snapshot.val();
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '';

        for (let userId in invitedUsers) {
            const li = document.createElement('li');
            li.textContent = invitedUsers[userId];
            usersList.appendChild(li);
        }
    });
}
