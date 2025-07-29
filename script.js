document.addEventListener('DOMContentLoaded', () => {
    console.log("Tarot mini-app initialized");
    
    // Основные элементы
    const container = document.getElementById('cards-container');
    const submitBtn = document.getElementById('submit-btn');
    const testBtn = document.getElementById('test-btn');
    const statusMessage = document.getElementById('status-message');
    
    // Список карт Таро с путями к изображениям
    const tarotCards = [
        { name: "Шут", image: "https://i.imgur.com/abc123.jpg" },
        { name: "Маг", image: "https://i.imgur.com/def456.jpg" },
        { name: "Жрица", image: "https://i.imgur.com/ghi789.jpg" },
        { name: "Императрица", image: "https://i.imgur.com/jkl012.jpg" },
        { name: "Император", image: "https://i.imgur.com/mno345.jpg" },
        { name: "Иерофант", image: "https://i.imgur.com/pqr678.jpg" },
        { name: "Влюбленные", image: "https://i.imgur.com/stu901.jpg" },
        { name: "Колесница", image: "https://i.imgur.com/vwx234.jpg" },
        { name: "Сила", image: "https://i.imgur.com/yzab56.jpg" },
        { name: "Отшельник", image: "https://i.imgur.com/cde789.jpg" },
        { name: "Колесо Фортуны", image: "https://i.imgur.com/fgh012.jpg" },
        { name: "Справедливость", image: "https://i.imgur.com/ijk345.jpg" },
        { name: "Повешенный", image: "https://i.imgur.com/lmn678.jpg" },
        { name: "Смерть", image: "https://i.imgur.com/opq901.jpg" },
        { name: "Умеренность", image: "https://i.imgur.com/rst234.jpg" },
        { name: "Дьявол", image: "https://i.imgur.com/uvw456.jpg" },
        { name: "Башня", image: "https://i.imgur.com/xyz789.jpg" },
        { name: "Звезда", image: "https://i.imgur.com/123abc.jpg" },
        { name: "Луна", image: "https://i.imgur.com/456def.jpg" },
        { name: "Солнце", image: "https://i.imgur.com/789ghi.jpg" },
        { name: "Суд", image: "https://i.imgur.com/012jkl.jpg" },
        { name: "Мир", image: "https://i.imgur.com/345mno.jpg" }
    ];
    
    // Выбранные карты
    const selectedCards = [];
    
    // Проверяем, запущено ли в Telegram
    const isTelegram = () => {
        return window.Telegram && Telegram.WebApp && Telegram.WebApp.initData;
    };
    
    // Обновление статусного сообщения
    const updateStatus = () => {
        if (selectedCards.length === 0) {
            statusMessage.textContent = "Нажмите на карты, чтобы перевернуть";
        } else {
            const names = selectedCards.map(card => card.name);
            statusMessage.textContent = `Выбрано: ${selectedCards.length}/3 карт`;
            statusMessage.innerHTML += `<div style="margin-top: 5px; font-size: 0.9em;">${names.join(', ')}</div>`;
        }
        submitBtn.disabled = selectedCards.length !== 3;
    };
    
    // Генерация случайных карт
    const generateCards = () => {
        const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 9);
    };
    
    // Отрисовка карт с анимацией переворота
    const renderCards = () => {
        container.innerHTML = '';
        const cards = generateCards();
        
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            // Обратная сторона карты (рубашка)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            // Лицевая сторона карты
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.style.backgroundImage = `url('${card.image}')`;
            cardFront.style.backgroundSize = 'cover';
            cardFront.style.backgroundPosition = 'center';
            
            // Название карты
            const cardName = document.createElement('div');
            cardName.className = 'card-name';
            cardName.textContent = card.name;
            cardFront.appendChild(cardName);
            
            cardInner.appendChild(cardBack);
            cardInner.appendChild(cardFront);
            cardElement.appendChild(cardInner);
            
            cardElement.addEventListener('click', () => {
                // Если карта уже перевернута и выбрана
                if (selectedCards.some(c => c.name === card.name)) {
                    const index = selectedCards.findIndex(c => c.name === card.name);
                    selectedCards.splice(index, 1);
                    cardElement.classList.remove('flipped', 'selected');
                } 
                // Если карту можно выбрать (еще не выбрано 3)
                else if (selectedCards.length < 3) {
                    // Переворачиваем только если еще не перевернута
                    if (!cardElement.classList.contains('flipped')) {
                        cardElement.classList.add('flipped');
                        setTimeout(() => {
                            selectedCards.push(card);
                            updateStatus();
                        }, 300); // Задержка для завершения анимации
                    }
                }
            });
            
            container.appendChild(cardElement);
        });
    };
    
    // Отправка данных в Telegram
    const sendDataToTelegram = (data) => {
        console.log("Sending data:", data);
        
        if (isTelegram()) {
            try {
                Telegram.WebApp.sendData(JSON.stringify(data));
                Telegram.WebApp.close();
                return true;
            } catch (e) {
                console.error("Send error:", e);
                statusMessage.textContent = "Ошибка отправки данных";
                return false;
            }
        } else {
            console.log("Not in Telegram, data not sent");
            statusMessage.textContent = "Отправка работает только в Telegram";
            return false;
        }
    };
    
    // Инициализация приложения
    const initApp = () => {
        // Если в Telegram - расширяем на весь экран
        if (isTelegram()) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            console.log("WebApp expanded");
        }
        
        // Настройка кнопки отправки
        submitBtn.addEventListener('click', () => {
            if (selectedCards.length !== 3) {
                statusMessage.textContent = "❌ Пожалуйста, выберите 3 карты";
                return;
            }
            
            statusMessage.textContent = "Отправка данных...";
            const cardNames = selectedCards.map(card => card.name);
            sendDataToTelegram({ selectedCards: cardNames });
        });
        
        // Тестовая кнопка
        testBtn.addEventListener('click', () => {
            statusMessage.textContent = "Отправка тестовых данных...";
            sendDataToTelegram({
                test: "Тест успешен!",
                selectedCards: ["Тест1", "Тест2", "Тест3"]
            });
        });
        
        // Отрисовываем карты
        renderCards();
        updateStatus();
    };
    
    // Запускаем приложение
    initApp();
});
