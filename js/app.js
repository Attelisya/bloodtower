/**
 * Главный файл приложения
 * Инициализирует UI и обработчики событий
 */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация UI
    window.ui = new UI();
    
    // Инициализация стартового экрана
    initStartScreen();
    
    // Инициализация экрана настройки
    initSetupScreen();
    
    // Инициализация игрового экрана
    initGameScreen();
});

/**
 * Инициализирует обработчики для стартового экрана
 */
function initStartScreen() {
    // Обработчик кнопки "Новая игра"
    document.getElementById('start-new-game').addEventListener('click', function() {
        window.ui.showScreen('setup-screen');
        
        // Добавляем первых 5 игроков по умолчанию
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            addPlayerField();
        }
    });
    
    // Обработчик кнопки "Загрузить игру"
    document.getElementById('load-game').addEventListener('click', function() {
        // Загрузка игры из локального хранилища
        window.ui.loadGameFromLocalStorage();
    });
    
    // Обработчик кнопки "О игре" уже инициализирован в modal-manager.js
}

/**
 * Инициализирует обработчики для экрана настройки
 */
function initSetupScreen() {
    // Обработчик кнопки "Добавить игрока"
    document.getElementById('add-player').addEventListener('click', function() {
        addPlayerField();
    });
    
    // Обработчик кнопки "Назад"
    document.getElementById('back-to-start').addEventListener('click', function() {
        window.ui.showScreen('start-screen');
    });
    
    // Обработчик кнопки "Начать игру"
    document.getElementById('start-game-btn').addEventListener('click', function() {
        startGame();
    });
    
    // Делегирование для удаления игроков
    document.getElementById('players-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-player-btn')) {
            const playerRow = e.target.closest('.player-input-row');
            
            // Проверяем, что останется минимум 5 игроков
            const playerRows = document.querySelectorAll('.player-input-row');
            if (playerRows.length > 5) {
                playerRow.remove();
            } else {
                alert('Минимальное количество игроков - 5');
            }
        }
    });
}

/**
 * Инициализирует обработчики для игрового экрана
 */
function initGameScreen() {
    // Кнопка "Показать журнал"
    document.getElementById('show-log').addEventListener('click', function() {
        const logElement = document.getElementById('game-log');
        logElement.style.display = logElement.style.display === 'none' ? 'block' : 'none';
    });
    
    // Кнопка "Очистить журнал"
    document.getElementById('clear-log').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить журнал?')) {
            window.ui.clearLog();
        }
    });
    
    // Кнопка "Закрыть журнал"
    document.getElementById('close-log').addEventListener('click', function() {
        document.getElementById('game-log').style.display = 'none';
    });
    
    // Кнопка "Переключить день/ночь"
    document.getElementById('day-night-toggle').addEventListener('click', function() {
        window.ui.toggleNightMode();
    });
    
    // Кнопка "Показать таймер"
    document.getElementById('show-timer').addEventListener('click', function() {
        const timerContainer = document.getElementById('timer-container');
        timerContainer.style.display = timerContainer.style.display === 'none' ? 'block' : 'none';
    });
    
    // Кнопка "Закрыть таймер"
    document.getElementById('close-timer').addEventListener('click', function() {
        document.getElementById('timer-container').style.display = 'none';
    });
    
    // Кнопка "Назад к настройкам"
    document.getElementById('back-to-setup').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите вернуться к настройкам? Текущая игра будет потеряна.')) {
            window.ui.showScreen('setup-screen');
        }
    });
    
    // Кнопка "Сохранить игру"
    document.getElementById('save-game').addEventListener('click', function() {
        window.ui.saveGameToLocalStorage();
        alert('Игра сохранена!');
    });
    
    // Нажатие на карточку игрока
    document.getElementById('players-grimoire').addEventListener('click', function(e) {
        const playerCard = e.target.closest('.player-role-item');
        
        if (playerCard) {
            const playerId = Number(playerCard.dataset.playerId);
            const player = window.ui.game.getPlayerById(playerId);
            
            if (player) {
                // Используем функцию из modal-manager.js
                window.openPlayerModal(player);
            }
        }
    });
}

/**
 * Добавляет поле для ввода имени игрока
 */
function addPlayerField() {
    const playersList = document.getElementById('players-list');
    const playerCount = playersList.querySelectorAll('.player-input-row').length;
    
    // Создаем новую строку для игрока
    const playerRow = document.createElement('div');
    playerRow.className = 'player-input-row';
    
    // Создаем поле ввода имени
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'player-name-input';
    nameInput.placeholder = `Игрок ${playerCount + 1}`;
    nameInput.required = true;
    
    // Создаем кнопку удаления
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-player-btn';
    removeButton.textContent = 'Удалить';
    
    // Добавляем элементы в строку
    playerRow.appendChild(nameInput);
    playerRow.appendChild(removeButton);
    
    // Добавляем строку в список
    playersList.appendChild(playerRow);
}

/**
 * Начинает игру
 */
function startGame() {
    // Получаем имена игроков
    const playerInputs = document.querySelectorAll('.player-name-input');
    const playerNames = Array.from(playerInputs).map(input => 
        input.value.trim() || input.placeholder
    );
    
    // Проверяем минимальное количество игроков
    if (playerNames.length < 5) {
        alert('Для начала игры необходимо минимум 5 игроков.');
        return;
    }
    
    // Получаем выбранный сценарий
    const scenarioSelect = document.getElementById('scenario-select');
    const selectedScenario = scenarioSelect.options[scenarioSelect.selectedIndex].text;
    
    // Получаем способ назначения ролей
    const roleAssignmentMode = document.querySelector('input[name="roles-assignment"]:checked').value;
    
    // Инициализируем игру
    const success = window.ui.startGame(selectedScenario, playerNames);
    
    if (success) {
        // Обрабатываем ручное назначение ролей
        if (roleAssignmentMode === 'manual') {
            // Получаем выбранные роли
            const roleSelects = document.querySelectorAll('.player-role-select');
            
            // Проверяем, что все роли выбраны
            const emptySelections = Array.from(roleSelects).filter(select => !select.value);
            
            if (emptySelections.length > 0) {
                alert('Пожалуйста, выберите роли для всех игроков.');
                return;
            }
            
            // Назначаем роли игрокам
            Array.from(roleSelects).forEach((select, index) => {
                const playerId = Number(select.dataset.playerId);
                const roleId = Number(select.value);
                
                // Находим роль
                const role = findRole(roleId, selectedScenario);
                
                if (role) {
                    // Определяем принадлежность роли
                    const alignment = isEvilRole(role.id, selectedScenario) ? 'evil' : 'good';
                    
                    // Обновляем игрока
                    window.ui.game.players[index].character = role;
                    window.ui.game.players[index].alignment = alignment;
                }
            });
            
            window.ui.refreshUI();
            window.ui.addToLog('Роли назначены вручную', 'system');
        }
        // Обрабатываем полуручное назначение ролей
        else if (roleAssignmentMode === 'semi-manual') {
            // Используем функцию из roles-manager.js
            if (typeof window.assignSemiManualRoles === 'function') {
                const result = window.assignSemiManualRoles();
                
                if (!result) {
                    return; // Если возникла ошибка, не продолжаем
                }
                
                window.ui.refreshUI();
                window.ui.addToLog('Роли назначены полуавтоматически', 'system');
            } else {
                console.error('Функция assignSemiManualRoles не найдена');
                alert('Ошибка: функция назначения ролей не найдена');
                return;
            }
        }
        // Автоматическое назначение ролей
        else {
            // Автоматическое назначение уже выполнено в ui.startGame()
            window.ui.addToLog('Роли назначены автоматически', 'system');
        }
        
        // Показываем игровой экран
        window.ui.showScreen('game-screen');
    }
}

/**
 * Находит роль по ID и сценарию
 * @param {number} roleId ID роли
 * @param {string} scenario Сценарий
 * @returns {Object|null} Объект роли или null
 */
function findRole(roleId, scenario) {
    if (!window.SCENARIOS[scenario]) return null;
    
    for (const category of ['good', 'outsiders', 'minions', 'demons']) {
        const role = window.SCENARIOS[scenario][category].find(r => r.id === roleId);
        if (role) return role;
    }
    
    return null;
}

/**
 * Проверяет, является ли роль злой
 * @param {number} roleId ID роли
 * @param {string} scenario Сценарий
 * @returns {boolean} true если роль злая
 */
function isEvilRole(roleId, scenario) {
    if (!window.SCENARIOS[scenario]) return false;
    
    // Проверяем, является ли роль миньоном или демоном
    const isMinion = window.SCENARIOS[scenario].minions.some(r => r.id === roleId);
    const isDemon = window.SCENARIOS[scenario].demons.some(r => r.id === roleId);
    
    return isMinion || isDemon;
}

// Функции openPlayerModal, showModal и hideModal удалены, 
// так как они уже определены в modal-manager.js и экспортированы в window 