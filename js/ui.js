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
     * Создает элемент карточки игрока для гримуара
     * @param {Object} player Объект игрока
     * @returns {HTMLElement} Элемент карточки
     */
    createPlayerCard(player) {
        const card = document.createElement('div');
        card.className = 'player-role-item';
        card.dataset.playerId = player.id;
        
        // Добавляем классы для состояний игрока
        if (!player.alive) {
            card.classList.add('dead-player');
        }
        
        if (player.poisoned) {
            card.classList.add('poisoned-player');
        }
        
        if (player.drunk) {
            card.classList.add('drunk-player');
        }
        
        if (player.protected) {
            card.classList.add('protected-player');
        }
        
        // Добавляем класс для команды (добрый/злой)
        if (player.alignment === 'good') {
            card.classList.add('good');
        } else if (player.alignment === 'evil') {
            card.classList.add('evil');
        }
        
        // Имя игрока
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        // Роль игрока
        const roleDiv = document.createElement('div');
        roleDiv.className = 'player-role-character';
        
        if (player.character) {
            roleDiv.textContent = player.character.name;
        } else {
            roleDiv.textContent = '—';
        }
        
        // Статус игрока
        const statusDiv = document.createElement('div');
        statusDiv.className = 'player-status';
        
        // Добавляем индикаторы статусов
        if (!player.alive) {
            const deadStatus = document.createElement('span');
            deadStatus.className = 'status-indicator status-dead';
            deadStatus.textContent = 'Мертв';
            statusDiv.appendChild(deadStatus);
        }
        
        if (player.poisoned) {
            const poisonedStatus = document.createElement('span');
            poisonedStatus.className = 'status-indicator status-poisoned';
            poisonedStatus.textContent = 'Отравлен';
            statusDiv.appendChild(poisonedStatus);
        }
        
        if (player.drunk) {
            const drunkStatus = document.createElement('span');
            drunkStatus.className = 'status-indicator status-drunk';
            drunkStatus.textContent = 'Пьян';
            statusDiv.appendChild(drunkStatus);
        }
        
        if (player.protected) {
            const protectedStatus = document.createElement('span');
            protectedStatus.className = 'status-indicator status-protected';
            protectedStatus.textContent = 'Защищен';
            statusDiv.appendChild(protectedStatus);
        }
        
        // Собираем карточку
        card.appendChild(nameDiv);
        card.appendChild(roleDiv);
        
        if (statusDiv.children.length > 0) {
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
            card.classList.toggle('dead-player', !player.alive);
            card.classList.toggle('poisoned-player', player.poisoned);
            card.classList.toggle('drunk-player', player.drunk);
            card.classList.toggle('protected-player', player.protected);
            
            // Обновляем классы для команды
            card.classList.toggle('good', player.alignment === 'good');
            card.classList.toggle('evil', player.alignment === 'evil');
            
            // Обновляем роль, если она изменилась
            const roleDiv = card.querySelector('.player-role-character');
            if (roleDiv) {
                if (player.character) {
                    roleDiv.textContent = player.character.name;
                } else {
                    roleDiv.textContent = '—';
                }
            }
            
            // Обновляем статусы
            let statusDiv = card.querySelector('.player-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.className = 'player-status';
                card.appendChild(statusDiv);
            }
            
            // Очищаем текущие статусы
            statusDiv.innerHTML = '';
            
            // Добавляем индикаторы статусов
            if (!player.alive) {
                const deadStatus = document.createElement('span');
                deadStatus.className = 'status-indicator status-dead';
                deadStatus.textContent = 'Мертв';
                statusDiv.appendChild(deadStatus);
            }
            
            if (player.poisoned) {
                const poisonedStatus = document.createElement('span');
                poisonedStatus.className = 'status-indicator status-poisoned';
                poisonedStatus.textContent = 'Отравлен';
                statusDiv.appendChild(poisonedStatus);
            }
            
            if (player.drunk) {
                const drunkStatus = document.createElement('span');
                drunkStatus.className = 'status-indicator status-drunk';
                drunkStatus.textContent = 'Пьян';
                statusDiv.appendChild(drunkStatus);
            }
            
            if (player.protected) {
                const protectedStatus = document.createElement('span');
                protectedStatus.className = 'status-indicator status-protected';
                protectedStatus.textContent = 'Защищен';
                statusDiv.appendChild(protectedStatus);
            }
            
            // Показываем или скрываем контейнер статусов
            if (statusDiv.children.length > 0) {
                statusDiv.style.display = 'flex';
            } else {
                statusDiv.style.display = 'none';
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

        // Проверяем, есть ли Барон среди выбранных миньонов
        const baronIndex = shuffledMinions.findIndex(role => role.id === 18);
        let townfolkCount = roleCounts.townfolk;
        let outsiderCount = roleCounts.outsiders;

        // Если Барон будет в игре, корректируем количество горожан и чужаков
        if (baronIndex !== -1 && baronIndex < roleCounts.minions) {
            townfolkCount -= 2;
            outsiderCount += 2;
            this.game.addToLog('Барон в игре: +2 чужака, -2 горожанина', 'system');
        }
        
        // Выбираем нужное количество ролей из каждой категории
        const selectedGood = shuffledGood.slice(0, townfolkCount);
        const selectedOutsiders = shuffledOutsiders.slice(0, outsiderCount);
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

/**
 * Обновляет список выбора ролей на основе выбранного сценария
 * @param {string} scenarioId ID сценария
 */
function updateRoleSelectionList(scenarioId) {
    const scenario = window.SCENARIOS[scenarioId];
    if (!scenario) return;
    
    const roleSelectionContainer = document.getElementById('role-selection-container');
    roleSelectionContainer.innerHTML = '';
    
    // Создаем контейнеры для категорий ролей
    const categories = [
        { type: 'good', title: 'Добрые жители', roles: scenario.good || [] },
        { type: 'outsider', title: 'Чужаки', roles: scenario.outsiders || [] },
        { type: 'minion', title: 'Приспешники', roles: scenario.minions || [] },
        { type: 'demon', title: 'Демоны', roles: scenario.demons || [] }
    ];
    
    // Количество выбранных ролей
    const roleCounts = document.createElement('div');
    roleCounts.className = 'role-counts mb-3';
    
    const goodCount = document.createElement('span');
    goodCount.className = 'role-count';
    goodCount.id = 'good-count';
    goodCount.textContent = 'Добрые: 0';
    
    const evilCount = document.createElement('span');
    evilCount.className = 'role-count';
    evilCount.id = 'evil-count';
    evilCount.textContent = 'Злые: 0';
    
    const totalCount = document.createElement('span');
    totalCount.className = 'role-count';
    totalCount.id = 'total-count';
    totalCount.textContent = 'Всего: 0';
    
    roleCounts.appendChild(goodCount);
    roleCounts.appendChild(evilCount);
    roleCounts.appendChild(totalCount);
    roleSelectionContainer.appendChild(roleCounts);
    
    // Создаем категории ролей
    categories.forEach(category => {
        if (category.roles.length === 0) return;
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = `role-category ${category.type}`;
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'role-category-title';
        categoryTitle.textContent = category.title;
        categoryDiv.appendChild(categoryTitle);
        
        category.roles.forEach(role => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'role-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `role-${role.id}`;
            checkbox.value = role.id;
            checkbox.dataset.roleType = category.type;
            
            const label = document.createElement('label');
            label.htmlFor = `role-${role.id}`;
            label.textContent = role.name;
            
            // Добавляем значок для первой ночи, если роль активна в первую ночь
            if (role.firstNight) {
                const firstNightBadge = document.createElement('span');
                firstNightBadge.className = 'badge badge-info ml-2';
                firstNightBadge.title = 'Активен в первую ночь';
                firstNightBadge.innerHTML = '1';
                label.appendChild(firstNightBadge);
            }
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            categoryDiv.appendChild(checkboxContainer);
            
            // Добавляем описание роли
            if (role.description) {
                const description = document.createElement('div');
                description.className = 'role-description';
                description.textContent = role.description;
                categoryDiv.appendChild(description);
            }
            
            // Добавляем обработчик события для подсчета выбранных ролей
            checkbox.addEventListener('change', updateSelectedRolesCount);
        });
        
        roleSelectionContainer.appendChild(categoryDiv);
    });
    
    // Инициализируем счетчики
    updateSelectedRolesCount();
}

/**
 * Обновляет счетчики выбранных ролей
 */
function updateSelectedRolesCount() {
    const goodRoles = document.querySelectorAll('input[data-role-type="good"]:checked').length;
    const outsiderRoles = document.querySelectorAll('input[data-role-type="outsider"]:checked').length;
    const minionRoles = document.querySelectorAll('input[data-role-type="minion"]:checked').length;
    const demonRoles = document.querySelectorAll('input[data-role-type="demon"]:checked').length;
    
    const totalGood = goodRoles + outsiderRoles;
    const totalEvil = minionRoles + demonRoles;
    const total = totalGood + totalEvil;
    
    document.getElementById('good-count').textContent = `Добрые: ${totalGood}`;
    document.getElementById('evil-count').textContent = `Злые: ${totalEvil}`;
    document.getElementById('total-count').textContent = `Всего: ${total}`;
    
    // Меняем цвет счетчиков в зависимости от баланса
    const goodCountElement = document.getElementById('good-count');
    const evilCountElement = document.getElementById('evil-count');
    
    if (totalGood > 0 && totalEvil > 0) {
        const ratio = totalGood / totalEvil;
        
        if (ratio < 1.5) {
            goodCountElement.style.color = '#ffcc00'; // Предупреждение - мало добрых
        } else if (ratio > 3.5) {
            evilCountElement.style.color = '#ffcc00'; // Предупреждение - мало злых
        } else {
            goodCountElement.style.color = '';
            evilCountElement.style.color = '';
        }
    }
}

/**
 * Добавляет запись в лог событий игры
 * @param {string} message Сообщение
 * @param {string} type Тип события (player-added, player-removed, status-changed, day-night, game-start)
 */
function addLogEntry(message, type = '') {
    const gameLog = document.getElementById('game-log');
    if (!gameLog) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    // Добавляем метку времени
    const time = document.createElement('span');
    time.className = 'time';
    const now = new Date();
    time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Добавляем сообщение
    const messageSpan = document.createElement('span');
    messageSpan.className = 'message';
    messageSpan.textContent = message;
    
    entry.appendChild(time);
    entry.appendChild(messageSpan);
    gameLog.appendChild(entry);
    
    // Прокручиваем лог до последней записи
    gameLog.scrollTop = gameLog.scrollHeight;
}

/**
 * Создает кнопку действия с современным стилем
 * @param {string} text Текст кнопки
 * @param {string} cssClass Дополнительный CSS класс
 * @param {Function} clickHandler Обработчик клика
 * @param {string} icon HTML-код иконки (опционально)
 * @returns {HTMLElement} Кнопка
 */
function createActionButton(text, cssClass, clickHandler, icon = '') {
    const button = document.createElement('button');
    button.className = `action-btn ${cssClass}`;
    
    // Добавляем иконку, если она указана
    if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        iconSpan.innerHTML = icon;
        button.appendChild(iconSpan);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    button.appendChild(textSpan);
    
    button.addEventListener('click', clickHandler);
    return button;
}

/**
 * Обновляет отображение кнопок действий для выбранного игрока
 * @param {Object} player Выбранный игрок
 * @param {Object} game Текущая игра
 */
function updatePlayerActions(player, game) {
    const actionsContainer = document.getElementById('player-actions');
    if (!actionsContainer) return;
    
    actionsContainer.innerHTML = '';
    
    if (!player) {
        actionsContainer.innerHTML = '<p class="text-muted">Выберите игрока для отображения действий</p>';
        return;
    }
    
    // Кнопки для изменения статуса жизни
    if (player.alive) {
        const killButton = createActionButton('Убить', 'kill', () => {
            game.killPlayer(player.id);
            addLogEntry(`Игрок ${player.name} убит.`, 'status-changed');
        }, '☠');
        actionsContainer.appendChild(killButton);
    } else {
        const reviveButton = createActionButton('Воскресить', 'revive', () => {
            game.revivePlayer(player.id);
            addLogEntry(`Игрок ${player.name} воскрешен.`, 'status-changed');
        }, '⚕');
        actionsContainer.appendChild(reviveButton);
    }
    
    // Кнопки для эффекта отравления
    if (player.poisoned) {
        const unpoisonButton = createActionButton('Убрать отравление', 'unpoison', () => {
            game.setPoisoned(player.id, false);
            addLogEntry(`С игрока ${player.name} снят эффект отравления.`, 'status-changed');
        }, '💊');
        actionsContainer.appendChild(unpoisonButton);
    } else {
        const poisonButton = createActionButton('Отравить', 'poison', () => {
            game.setPoisoned(player.id, true);
            addLogEntry(`Игрок ${player.name} отравлен.`, 'status-changed');
        }, '🧪');
        actionsContainer.appendChild(poisonButton);
    }
    
    // Кнопки для эффекта опьянения
    if (player.drunk) {
        const soberButton = createActionButton('Отрезвить', 'sober', () => {
            game.setDrunk(player.id, false);
            addLogEntry(`С игрока ${player.name} снят эффект опьянения.`, 'status-changed');
        }, '🍵');
        actionsContainer.appendChild(soberButton);
    } else {
        const drunkButton = createActionButton('Напоить', 'drunk', () => {
            game.setDrunk(player.id, true);
            addLogEntry(`Игрок ${player.name} пьян.`, 'status-changed');
        }, '🍺');
        actionsContainer.appendChild(drunkButton);
    }
    
    // Кнопки для эффекта защиты
    if (player.protected) {
        const unprotectButton = createActionButton('Снять защиту', 'unprotect', () => {
            game.setProtected(player.id, false);
            addLogEntry(`С игрока ${player.name} снята защита.`, 'status-changed');
        }, '🛑');
        actionsContainer.appendChild(unprotectButton);
    } else {
        const protectButton = createActionButton('Защитить', 'protect', () => {
            game.setProtected(player.id, true);
            addLogEntry(`Игрок ${player.name} защищен.`, 'status-changed');
        }, '🛡');
        actionsContainer.appendChild(protectButton);
    }
} 