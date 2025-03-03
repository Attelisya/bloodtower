// Импорт классов не требуется в браузере,
// так как Game уже доступен после загрузки game.js

/**
 * Класс для управления пользовательским интерфейсом
 */
class UI {
    constructor() {
        // Инициализация игры
        this.game = new Game();
        
        // Текущий экран
        this.currentScreen = 'start-screen';
        
        // Инициализация обработчиков событий
        this.initEventListeners();
    }
    
    /**
     * Инициализирует обработчики событий
     */
    initEventListeners() {
        // Обработчики событий игры
        document.addEventListener('game:logUpdated', this.handleLogUpdate.bind(this));
        document.addEventListener('game:playerUpdated', this.handlePlayerUpdate.bind(this));
        document.addEventListener('game:nightModeChanged', this.handleNightModeChange.bind(this));
        document.addEventListener('game:stateLoaded', this.handleGameStateLoaded.bind(this));
    }
    
    /**
     * Показывает указанный экран
     * @param {string} screenId ID экрана
     */
    showScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Показываем нужный экран
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
            this.currentScreen = screenId;
            
            // Вызываем событие для обновления UI
            const event = new CustomEvent('ui:screenChanged', {
                detail: { screen: screenId }
            });
            document.dispatchEvent(event);
        } else {
            console.error(`Экран с ID ${screenId} не найден`);
        }
    }
    
    /**
     * Обработчик обновления журнала
     * @param {Event} event Событие
     */
    handleLogUpdate(event) {
        const logEntry = event.detail.logEntry;
        this.updateLog(logEntry);
    }
    
    /**
     * Обработчик обновления игрока
     * @param {Event} event Событие
     */
    handlePlayerUpdate(event) {
        const player = event.detail.player;
        this.updatePlayerCard(player);
    }
    
    /**
     * Обработчик изменения режима день/ночь
     * @param {Event} event Событие
     */
    handleNightModeChange(event) {
        const isNight = event.detail.isNight;
        const currentDay = event.detail.currentDay;
        
        this.updateNightMode(isNight);
        this.updateDayCounter(currentDay);
    }
    
    /**
     * Обработчик загрузки состояния игры
     * @param {Event} event Событие
     */
    handleGameStateLoaded(event) {
        const gameState = event.detail.gameState;
        
        // Обновляем интерфейс
        this.refreshUI();
    }
    
    /**
     * Обновляет интерфейс
     */
    refreshUI() {
        // Обновляем журнал
        this.updateLogList();
        
        // Обновляем список игроков
        this.updatePlayersList();
        
        // Обновляем режим день/ночь
        this.updateNightMode(this.game.isNight);
        
        // Обновляем счетчик дней
        this.updateDayCounter(this.game.currentDay);
    }
    
    /**
     * Обновляет список записей журнала
     */
    updateLogList() {
        const logContainer = document.getElementById('game-log-content');
        if (!logContainer) return;
        
        // Очищаем список
        logContainer.innerHTML = '';
        
        // Добавляем записи из журнала
        this.game.eventLog.forEach(entry => {
            this.updateLog(entry, true);
        });
        
        // Прокручиваем журнал вниз
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    /**
     * Обновляет запись в журнале
     * @param {Object} logEntry Запись журнала
     * @param {boolean} append Добавить в конец (false - заменить)
     */
    updateLog(logEntry, append = true) {
        const logContainer = document.getElementById('game-log-content');
        if (!logContainer) return;
        
        // Создаем элемент записи
        const logItem = document.createElement('div');
        logItem.className = `log-item log-type-${logEntry.type}`;
        logItem.dataset.logId = logEntry.id;
        
        // Создаем заголовок записи с меткой времени
        const logHeader = document.createElement('div');
        logHeader.className = 'log-header';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = logEntry.timestamp;
        
        const phaseSpan = document.createElement('span');
        phaseSpan.className = 'log-phase';
        phaseSpan.textContent = logEntry.dayInfo;
        
        logHeader.appendChild(timeSpan);
        logHeader.appendChild(phaseSpan);
        
        // Создаем текст записи
        const logText = document.createElement('div');
        logText.className = 'log-message';
        logText.textContent = logEntry.message;
        
        // Собираем запись
        logItem.appendChild(logHeader);
        logItem.appendChild(logText);
        
        // Добавляем в контейнер
        if (append) {
            logContainer.appendChild(logItem);
        } else {
            const existingItem = logContainer.querySelector(`[data-log-id="${logEntry.id}"]`);
            if (existingItem) {
                logContainer.replaceChild(logItem, existingItem);
            } else {
                logContainer.appendChild(logItem);
            }
        }
        
        // Прокручиваем журнал вниз
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    /**
     * Обновляет список игроков
     */
    updatePlayersList() {
        const container = document.getElementById('players-grimoire');
        if (!container) return;
        
        // Очищаем список
        container.innerHTML = '';
        
        // Добавляем игроков
        this.game.players.forEach(player => {
            const playerCard = this.createPlayerCard(player);
            container.appendChild(playerCard);
        });
    }
    
    /**
     * Создает карточку игрока
     * @param {Object} player Игрок
     * @returns {HTMLElement} Карточка игрока
     */
    createPlayerCard(player) {
        // Контейнер карточки
        const card = document.createElement('div');
        card.className = 'player-role-item';
        card.dataset.playerId = player.id;
        
        if (!player.alive) {
            card.classList.add('player-dead');
        }
        
        if (player.poisoned) {
            card.classList.add('player-poisoned');
        }
        
        if (player.drunk) {
            card.classList.add('player-drunk');
        }
        
        if (player.protected) {
            card.classList.add('player-protected');
        }
        
        // Имя игрока
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        // Роль игрока
        const roleDiv = document.createElement('div');
        roleDiv.className = 'player-role';
        
        if (player.character) {
            roleDiv.textContent = player.character.name;
            
            // Добавляем класс в зависимости от типа персонажа
            if (player.alignment === 'good') {
                card.classList.add('player-good');
            } else if (player.alignment === 'evil') {
                card.classList.add('player-evil');
            }
        } else {
            roleDiv.textContent = '—';
        }
        
        // Статус игрока
        const statusDiv = document.createElement('div');
        statusDiv.className = 'player-status';
        
        const statusIcons = [];
        
        if (!player.alive) {
            statusIcons.push('☠');
        }
        
        if (player.poisoned) {
            statusIcons.push('🧪');
        }
        
        if (player.drunk) {
            statusIcons.push('🍺');
        }
        
        if (player.protected) {
            statusIcons.push('🛡');
        }
        
        statusDiv.textContent = statusIcons.join(' ');
        
        // Собираем карточку
        card.appendChild(nameDiv);
        card.appendChild(roleDiv);
        
        if (statusIcons.length > 0) {
            card.appendChild(statusDiv);
        }
        
        return card;
    }
    
    /**
     * Обновляет карточку игрока
     * @param {Object} player Игрок
     */
    updatePlayerCard(player) {
        const card = document.querySelector(`.player-role-item[data-player-id="${player.id}"]`);
        
        if (card) {
            // Обновляем классы состояния
            card.classList.toggle('player-dead', !player.alive);
            card.classList.toggle('player-poisoned', player.poisoned);
            card.classList.toggle('player-drunk', player.drunk);
            card.classList.toggle('player-protected', player.protected);
            
            // Обновляем статусы
            const statusDiv = card.querySelector('.player-status') || document.createElement('div');
            statusDiv.className = 'player-status';
            
            const statusIcons = [];
            
            if (!player.alive) {
                statusIcons.push('☠');
            }
            
            if (player.poisoned) {
                statusIcons.push('🧪');
            }
            
            if (player.drunk) {
                statusIcons.push('🍺');
            }
            
            if (player.protected) {
                statusIcons.push('🛡');
            }
            
            statusDiv.textContent = statusIcons.join(' ');
            
            if (statusIcons.length > 0) {
                if (!card.querySelector('.player-status')) {
                    card.appendChild(statusDiv);
                }
            } else {
                const existingStatusDiv = card.querySelector('.player-status');
                if (existingStatusDiv) {
                    card.removeChild(existingStatusDiv);
                }
            }
        } else {
            // Если карточка не найдена, обновляем весь список
            this.updatePlayersList();
        }
    }
    
    /**
     * Обновляет режим день/ночь
     * @param {boolean} isNight Признак ночи
     */
    updateNightMode(isNight) {
        // Обновляем классы для тела документа
        document.body.classList.toggle('night-mode', isNight);
        
        // Обновляем текст кнопки
        const toggleButton = document.getElementById('day-night-toggle');
        if (toggleButton) {
            toggleButton.textContent = isNight ? 'Переключить на день' : 'Переключить на ночь';
        }
        
        // Обновляем элементы игры
        const gameScreenElement = document.getElementById('game-screen');
        if (gameScreenElement) {
            gameScreenElement.classList.toggle('night-mode', isNight);
        }
        
        // Обновляем классы для игроков
        document.querySelectorAll('.player-role-item').forEach(card => {
            card.classList.toggle('night-mode', isNight);
        });
    }
    
    /**
     * Обновляет счетчик дней
     * @param {number} day Номер дня
     */
    updateDayCounter(day) {
        const counter = document.getElementById('day-counter');
        if (counter) {
            counter.textContent = `День ${day}`;
        }
    }
    
    /**
     * Инициализирует игру
     * @param {string} scenario Выбранный сценарий
     * @param {Array} playerNames Список имен игроков
     * @returns {boolean} Успешность инициализации
     */
    startGame(scenario, playerNames) {
        // Инициализируем игру
        const result = this.game.initializeGame(scenario, playerNames);
        
        if (result) {
            // Автоматическое распределение ролей
            this.assignRolesAutomatically(scenario);
            
            // Обновляем интерфейс
            this.refreshUI();
            
            // Показываем экран игры
            this.showScreen('game-screen');
        }
        
        return result;
    }
    
    /**
     * Автоматически распределяет роли между игроками
     * @param {string} scenario Выбранный сценарий
     */
    assignRolesAutomatically(scenario) {
        // Получаем данные о сценарии
        const scenarioData = window.SCENARIOS[scenario] || window.SCENARIOS["Неприятности назревают"];
        
        if (!scenarioData) {
            console.error('Ошибка: сценарий не найден');
            return false;
        }
        
        // Получаем количество игроков
        const playerCount = this.game.players.length;
        
        // Получаем рекомендуемое количество ролей для данного числа игроков
        const roleCounts = this.game.getPlayerCounts();
        
        // Создаем массивы ролей по категориям
        const goodRoles = [...scenarioData.good];
        const outsiderRoles = [...scenarioData.outsiders];
        const minionRoles = [...scenarioData.minions];
        const demonRoles = [...scenarioData.demons];
        
        // Перемешиваем массивы ролей
        const shuffledGood = this.shuffleArray(goodRoles);
        const shuffledOutsiders = this.shuffleArray(outsiderRoles);
        const shuffledMinions = this.shuffleArray(minionRoles);
        const shuffledDemons = this.shuffleArray(demonRoles);
        
        // Выбираем нужное количество ролей из каждой категории
        const selectedGood = shuffledGood.slice(0, roleCounts.townfolk);
        const selectedOutsiders = shuffledOutsiders.slice(0, roleCounts.outsiders);
        const selectedMinions = shuffledMinions.slice(0, roleCounts.minions);
        const selectedDemons = shuffledDemons.slice(0, roleCounts.demons);
        
        // Объединяем все выбранные роли
        const allSelectedRoles = [
            ...selectedGood.map(role => ({ ...role, alignment: 'good' })),
            ...selectedOutsiders.map(role => ({ ...role, alignment: 'good' })),
            ...selectedMinions.map(role => ({ ...role, alignment: 'evil' })),
            ...selectedDemons.map(role => ({ ...role, alignment: 'evil' }))
        ];
        
        // Перемешиваем все роли
        const shuffledRoles = this.shuffleArray(allSelectedRoles);
        
        // Назначаем роли игрокам
        this.game.players.forEach((player, index) => {
            if (index < shuffledRoles.length) {
                const role = shuffledRoles[index];
                player.character = role;
                player.alignment = role.alignment;
            }
        });
        
        // Добавляем запись в журнал
        this.game.addToLog('Роли распределены автоматически', 'system');
        
        return true;
    }
    
    /**
     * Перемешивает массив (алгоритм Фишера-Йейтса)
     * @param {Array} array Исходный массив
     * @returns {Array} Перемешанный массив
     */
    shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    
    /**
     * Возвращает режим день/ночь
     * @returns {boolean} true - ночь, false - день
     */
    isNightMode() {
        return this.game.isNight;
    }
    
    /**
     * Переключает режим день/ночь
     * @returns {boolean} Новое состояние
     */
    toggleNightMode() {
        return this.game.toggleNightMode();
    }
    
    /**
     * Обновляет состояние игрока
     * @param {number} playerId ID игрока
     * @param {string} state Состояние
     * @param {boolean} value Значение
     * @returns {Object|null} Обновленный игрок или null при ошибке
     */
    updatePlayerState(playerId, state, value) {
        return this.game.updatePlayerState(playerId, state, value);
    }
    
    /**
     * Добавляет запись в журнал
     * @param {string} message Сообщение
     * @param {string} type Тип сообщения
     * @returns {Object} Новая запись
     */
    addToLog(message, type = 'system') {
        return this.game.addToLog(message, type);
    }
    
    /**
     * Очищает журнал событий
     */
    clearLog() {
        this.game.eventLog = [];
        this.updateLogList();
        this.addToLog('Журнал очищен', 'system');
    }
    
    /**
     * Экспортирует состояние игры
     * @returns {Object} Состояние игры
     */
    exportGameState() {
        return this.game.exportGameState();
    }
    
    /**
     * Импортирует состояние игры
     * @param {Object} gameState Состояние игры
     * @returns {boolean} Успешность импорта
     */
    importGameState(gameState) {
        return this.game.importGameState(gameState);
    }
    
    /**
     * Сохраняет игру в локальное хранилище
     * @param {string} saveName Название сохранения
     * @returns {boolean} Успешность сохранения
     */
    saveGameToLocalStorage(saveName = 'autosave') {
        try {
            const gameState = this.exportGameState();
            const saveData = {
                timestamp: new Date().toISOString(),
                name: saveName,
                state: gameState
            };
            
            localStorage.setItem(`btcg_save_${saveName}`, JSON.stringify(saveData));
            this.addToLog(`Игра сохранена: ${saveName}`, 'system');
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении игры:', error);
            return false;
        }
    }
    
    /**
     * Загружает игру из локального хранилища
     * @param {string} saveName Название сохранения
     * @returns {boolean} Успешность загрузки
     */
    loadGameFromLocalStorage(saveName = 'autosave') {
        try {
            const saveJson = localStorage.getItem(`btcg_save_${saveName}`);
            
            if (!saveJson) {
                console.error(`Сохранение "${saveName}" не найдено`);
                return false;
            }
            
            const saveData = JSON.parse(saveJson);
            
            if (!saveData || !saveData.state) {
                console.error('Некорректный формат сохранения');
                return false;
            }
            
            const result = this.importGameState(saveData.state);
            
            if (result) {
                this.addToLog(`Игра загружена: ${saveName}`, 'system');
                this.showScreen('game-screen');
            }
            
            return result;
        } catch (error) {
            console.error('Ошибка при загрузке игры:', error);
            return false;
        }
    }
    
    /**
     * Получает список доступных сохранений
     * @returns {Array} Список сохранений
     */
    getSavedGamesList() {
        const saves = [];
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                if (key && key.startsWith('btcg_save_')) {
                    const saveJson = localStorage.getItem(key);
                    
                    try {
                        const saveData = JSON.parse(saveJson);
                        
                        if (saveData && saveData.timestamp) {
                            saves.push({
                                key: key.replace('btcg_save_', ''),
                                name: saveData.name || key.replace('btcg_save_', ''),
                                timestamp: new Date(saveData.timestamp),
                                playerCount: saveData.state?.players?.length || 0
                            });
                        }
                    } catch (e) {
                        console.warn(`Ошибка при чтении сохранения ${key}:`, e);
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка при получении списка сохранений:', error);
        }
        
        // Сортируем по времени создания (новые сначала)
        saves.sort((a, b) => b.timestamp - a.timestamp);
        
        return saves;
    }
}

// Экспортируем класс UI
window.UI = UI;

// Функция для добавления динамических стилей
function addDynamicStyles() {
    // Добавление стилей для ночного режима
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        body.night-mode {
            background-color: #0a0a0f;
            color: #b0c4de;
        }
        
        body.night-mode .grimoire-section {
            background-color: rgba(10, 10, 15, 0.9);
            border-color: #4a0000;
        }
        
        body.night-mode .character-item:hover {
            background-color: rgba(50, 50, 100, 0.3);
        }
        
        body.night-mode .player-role-item {
            background-color: rgba(10, 10, 20, 0.7);
        }
        
        body.night-mode .btn {
            background-color: #1a1a2a;
            color: #b0c4de;
        }
        
        body.night-mode .btn:hover {
            background-color: #2a2a3a;
        }
        
        body.night-mode .btn-primary {
            background-color: #00008B;
        }
        
        body.night-mode .btn-primary:hover {
            background-color: #0000CD;
        }
    `;
    document.head.appendChild(styleElement);
    
    console.log("Динамические стили добавлены");
}

// Экспорт класса UI не требуется в браузере
// if (typeof module !== 'undefined') {
//     module.exports = { UI };
// } 