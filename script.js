// Функция для получения данных о рефералах с сервера
async function getReferrals(userId) {
  try {
    const response = await fetch(`https://your-server-url/get_referrals?user_id=${userId}`);
    const data = await response.json();

    if (data.referrals) {
      displayReferrals(data.referrals);
    } else {
      console.error("Ошибка получения данных о рефералах:", data.error);
    }
  } catch (error) {
    console.error("Ошибка запроса к серверу:", error);
  }
}

// Функция для отображения данных о рефералах
function displayReferrals(referrals) {
  const referralsElement = document.getElementById('referrals');
  if (referrals.length > 0) {
    referralsElement.innerHTML = "Рефералы: " + referrals.join(', ');
  } else {
    referralsElement.innerHTML = "Нет рефералов.";
  }
}

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Применяем режим полного экрана для мини-приложения
window.Telegram.WebApp.expand();
window.Telegram.WebApp.requestFullscreen();

// Убедитесь, что Web App готов
tg.ready();

// Получение данных о пользователе
const user = tg.initDataUnsafe?.user || {};
const userId = user.id;  // Получаем ID пользователя

// Отображение имени пользователя
const usernameElement = document.getElementById('username');
if (usernameElement) {
  usernameElement.textContent = `Привет, ${user.first_name}!`;
}

// Получение данных о рефералах
getReferrals(userId);
