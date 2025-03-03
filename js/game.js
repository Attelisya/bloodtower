/**
 * Класс для управления игровой логикой
 */
class Game {
    constructor() {
        // Список игроков
        this.players = [];
        
        // Состояние игры (день/ночь)
        this.isNight = false;
        
        // Номер текущего дня
        this.currentDay = 1;
        
        // Активный сценарий
        this.activeScenario = 'trouble_brewing';
        
        // Список доступных персонажей по сценариям
        this.characters = {
            trouble_brewing: {
                good: [
                    {id: 1, name: 'Прачка', ability: 'В первую ночь вы узнаете о двух игроках, что один из них Горожанин.'},
                    {id: 2, name: 'Библиотекарь', ability: 'В первую ночь вы узнаете о двух игроках, что один из них Чужак.'},
                    {id: 3, name: 'Следователь', ability: 'В первую ночь вы узнаете о двух игроках, что один из них Миньон.'},
                    {id: 4, name: 'Повар', ability: 'В первую ночь вы узнаете, сидят ли рядом два злых игрока.'},
                    {id: 5, name: 'Эмпат', ability: 'Каждую ночь: вы узнаете число злых игроков среди двух ваших живых соседей.'},
                    {id: 6, name: 'Гадалка', ability: 'Каждую ночь: выберите двух игроков. Вы узнаете, есть ли среди них Демон. Один из добрых игроков определяется вами как Демон.'},
                    {id: 7, name: 'Сивилла', ability: 'Каждый день, после казни, вы узнаете роль казненного игрока.'},
                    {id: 8, name: 'Монах', ability: 'Каждую ночь выберите живого игрока (кроме себя), который не может умереть от атаки демона.'},
                    {id: 9, name: 'Трактирщик', ability: 'Один раз в игру, днем, публично выберите игрока: если это Демон, он умирает.'},
                    {id: 10, name: 'Девственница', ability: 'Первый раз, когда вас номинируют, если номинирующий – Горожанин, его немедленно казнят.'},
                    {id: 11, name: 'Солдат', ability: 'Вы не можете умереть от атаки демона.'},
                    {id: 12, name: 'Мэр', ability: 'Если в живых осталось 3 игрока и не происходит казни, ваша команда побеждает. Если вы умираете ночью, вместо вас может умереть другой игрок.'},
                    {id: 13, name: 'Дознаватель', ability: 'В первую ночь вы узнаете, какой из двух игроков Горожанин, а какой Чужак.'}
                ],
                outsiders: [
                    {id: 14, name: 'Дворецкий', ability: 'Каждую ночь вы узнаете, какого игрока вы должны выбрать при голосовании на следующий день.'},
                    {id: 15, name: 'Пьяница', ability: 'Вы не знаете, что вы пьяница. Вы думаете, что вы другой персонаж, но ваша способность не действует.'},
                    {id: 16, name: 'Отшельник', ability: 'Вы можете регистрироваться рассказчику как злой, и можете быть выбраны для злых способностей.'},
                    {id: 17, name: 'Святой', ability: 'Если вас казнили, ваша команда проигрывает.'}
                ],
                minions: [
                    {id: 18, name: 'Барон', ability: 'В игре на 2 чужака больше, чем обычно.'},
                    {id: 19, name: 'Отравитель', ability: 'Каждую ночь выберите игрока, его способность не будет действовать до следующей ночи.'},
                    {id: 20, name: 'Шпион', ability: 'Каждую ночь вы видите список гримуара, из которого узнаете, какой игрок какую роль имеет.'},
                    {id: 21, name: 'Шарлатанка', ability: 'Если Демон умирает, вы становитесь Демоном. Сила Шарлатанки может действовать даже ночью, когда вы умираете.'}
                ],
                demons: [
                    {id: 22, name: 'Имп', ability: 'Каждую ночь выберите игрока: он умирает. Если вы выбрали себя, то случайный живой Миньон становится Импом, а вы умираете.'}
                ]
            },
            bad_moon_rising: {
                // Добавьте персонажей для второго сценария
                good: [
                    {id: 101, name: 'Бальзамировщик', ability: 'Каждую ночь, если казненный сегодня игрок был добрым, вы узнаете роль казненного.'},
                    {id: 102, name: 'Каннибал', ability: 'Вы получаете способность последнего казненного игрока.'},
                    {id: 103, name: 'Судья', ability: 'Один раз за игру вы можете решить казнить кого-то или нет.'},
                    {id: 104, name: 'Мясник', ability: 'Если вы казнены, то может быть казнен дополнительный игрок.'},
                    {id: 105, name: 'Дворянин', ability: 'Вы начинаете с информацией о 3 граждан, которые не в игре.'},
                    {id: 106, name: 'Утка', ability: 'Если вы умираете, то добрый негражданин начинает выступать как зло.'},
                    {id: 107, name: 'Тюремщик', ability: 'Каждую ночь выберите игрока, если он умирает ночью, умирают соседние игроки.'},
                    {id: 108, name: 'Охотник', ability: 'Ночью в первый раз, когда умрет добрый негражданин, выберите игрока, он умирает.'},
                    {id: 109, name: 'Стражник', ability: 'Каждую ночь выберите живого игрока, если демон попытается его убить, он не умрет.'},
                    {id: 110, name: 'Городовой', ability: 'Если вас казнят, следующей ночью все живые игроки знают двух чужаков.'},
                    {id: 111, name: 'Шаман', ability: 'Каждую ночь вы узнаете, был ли убит демоном хотя бы один из живых игроков, которых вы выбрали.'},
                    {id: 112, name: 'Городской страж', ability: 'Вы начинаете с информацией о том, какой тип чужаков в игре.'}
                ],
                outsiders: [
                    {id: 113, name: 'По', ability: 'Вы начинаете пьяными. Если демон выбирает вас, чтобы убить, вы умираете и демон убивает снова.'},
                    {id: 114, name: 'Лунатик', ability: 'Вы думаете, что вы демон, но вы добрый. Демон знает, кто вы.'},
                    {id: 115, name: 'Мутант', ability: 'Если хотя бы половина живых игроков одновременно выбрали вас голосованием, вы казнены.'},
                    {id: 116, name: 'Дитя тумана', ability: 'Вы можете быть выбраны демоном для убийства, даже когда защищены.'}
                ],
                minions: [
                    {id: 117, name: 'Бармен', ability: 'Каждую ночь, выберите живого игрока: что-то изменится с ним, а что-то, нет.'},
                    {id: 118, name: 'Черный дрозд', ability: 'Если демон умирает, то выберите нового демона из числа миньонов. Никаких дополнительных миньонов не появляется.'},
                    {id: 119, name: 'Дьявол', ability: 'Каждую ночь выберите живого игрока. Если его способность работала сегодня, рассказчик выполняет действие любого мертвого персонажа.'},
                    {id: 120, name: 'Ассасин', ability: 'Один раз за игру ночью выберите живого игрока: он умирает. Если выбор падает на демона, вместо этого умирает случайный другой игрок.'},
                    {id: 121, name: 'Психопат', ability: 'Каждый день вы должны публично выбрать выжившего игрока. Если все верят, что указанный игрок - демон, вы побеждаете.'},
                    {id: 122, name: 'Сектант', ability: 'Все чужаки считаются миньонами, а не чужаками.'}
                ],
                demons: [
                    {id: 123, name: 'Зомби', ability: 'Каждую ночь* выберите игрока: он умирает. Если вас казнили, вы все равно побеждаете, если хотя бы один миньон жив.'},
                    {id: 124, name: 'Шабаш', ability: 'Каждую ночь* выберите игрока: он умирает. Добрый сосед тоже может быть отравлен.'},
                    {id: 125, name: 'Лилу', ability: 'Каждую ночь* выберите игрока: он умирает. Все персонажи, имеющие одинаковые первые буквы характера, считаются соседями.'}
                ]
            }
        };
        
        // Журнал событий
        this.eventLog = [];
    }

    /**
     * Инициализирует новую игру
     * @param {string} scenario Выбранный сценарий
     * @param {Array} players Список игроков
     * @returns {boolean} Успешность инициализации
     */
    initializeGame(scenario, players) {
        if (!scenario || !players || !Array.isArray(players) || players.length < 5) {
            console.error('Неверные параметры для инициализации игры');
            return false;
        }
        
        // Сбрасываем состояние игры
        this.reset();
        
        // Устанавливаем сценарий
        this.activeScenario = scenario;
        
        // Инициализируем игроков
        this.players = players.map((name, index) => ({
            id: index + 1,
            name: name,
            character: null,
            alignment: null,
            alive: true,
            poisoned: false,
            drunk: false,
            protected: false
        }));
        
        // Добавляем запись в журнал
        this.addToLog('Игра инициализирована', 'system');
        this.addToLog(`Выбран сценарий: ${this.getScenarioName(scenario)}`, 'system');
        this.addToLog(`Количество игроков: ${this.players.length}`, 'system');
        
        return true;
    }
    
    /**
     * Сбрасывает состояние игры
     */
    reset() {
        this.players = [];
        this.isNight = false;
        this.currentDay = 1;
        this.eventLog = [];
    }
    
    /**
     * Возвращает название сценария
     * @param {string} scenarioKey Ключ сценария
     * @returns {string} Название сценария
     */
    getScenarioName(scenarioKey) {
        const scenarioNames = {
            'trouble_brewing': 'Пивоварение',
            'bad_moon_rising': 'Восход кровавой луны'
        };
        
        return scenarioNames[scenarioKey] || scenarioKey;
    }
    
    /**
     * Добавляет событие в журнал
     * @param {string} message Сообщение
     * @param {string} type Тип сообщения (system, player, night, day)
     */
    addToLog(message, type = 'system') {
        const timestamp = new Date().toLocaleTimeString();
        const dayInfo = this.isNight ? `Ночь ${this.currentDay}` : `День ${this.currentDay}`;
        
        this.eventLog.push({
            id: this.eventLog.length + 1,
            message: message,
            type: type,
            day: this.currentDay,
            isNight: this.isNight,
            dayInfo: dayInfo,
            timestamp: timestamp
        });
        
        // Вызываем событие для обновления UI
        const event = new CustomEvent('game:logUpdated', {
            detail: { logEntry: this.eventLog[this.eventLog.length - 1] }
        });
        document.dispatchEvent(event);
        
        return this.eventLog[this.eventLog.length - 1];
    }
    
    /**
     * Переключает режим день/ночь
     * @returns {boolean} Новое состояние (true - ночь, false - день)
     */
    toggleNightMode() {
        this.isNight = !this.isNight;
        
        // Если наступил новый день, увеличиваем счетчик
        if (!this.isNight) {
            this.currentDay++;
        }
        
        // Если наступила ночь, сбрасываем эффекты
        if (this.isNight) {
            // Сбрасываем эффекты отравления, опьянения и защиты у всех игроков
            this.players.forEach(player => {
                if (player.poisoned) {
                    player.poisoned = false;
                    this.addToLog(`${player.name} больше не отравлен (эффект истек)`, 'player');
                }
                
                if (player.drunk) {
                    player.drunk = false;
                    this.addToLog(`${player.name} больше не пьян (эффект истек)`, 'player');
                }
                
                if (player.protected) {
                    player.protected = false;
                    this.addToLog(`${player.name} больше не защищен (эффект истек)`, 'player');
                }
                
                // Вызываем событие для обновления UI для каждого игрока с изменившимся статусом
                const playerEvent = new CustomEvent('game:playerUpdated', {
                    detail: { player: player }
                });
                document.dispatchEvent(playerEvent);
            });
        }
        
        // Логируем изменение
        const stateMessage = this.isNight ? 
            `Наступила ночь ${this.currentDay}` : 
            `Наступил день ${this.currentDay}`;
        this.addToLog(stateMessage, this.isNight ? 'night' : 'day');
        
        // Вызываем событие для обновления UI
        const event = new CustomEvent('game:nightModeChanged', {
            detail: { isNight: this.isNight, currentDay: this.currentDay }
        });
        document.dispatchEvent(event);
        
        return this.isNight;
    }
    
    /**
     * Изменяет состояние игрока
     * @param {number} playerId ID игрока
     * @param {string} state Состояние (alive, poisoned, drunk, protected)
     * @param {boolean} value Новое значение
     * @returns {Object|null} Обновленный игрок или null при ошибке
     */
    updatePlayerState(playerId, state, value) {
        const player = this.players.find(p => p.id === playerId);
        
        if (!player) {
            console.error(`Игрок с ID ${playerId} не найден`);
            return null;
        }
        
        // Обновляем состояние игрока
        switch(state) {
            case 'alive':
                player.alive = value;
                this.addToLog(`${player.name} ${value ? 'вернулся к жизни' : 'умер'}`, 'player');
                break;
            case 'poisoned':
                player.poisoned = value;
                this.addToLog(`${player.name} ${value ? 'отравлен' : 'больше не отравлен'}`, 'player');
                break;
            case 'drunk':
                player.drunk = value;
                this.addToLog(`${player.name} ${value ? 'пьян' : 'трезв'}`, 'player');
                break;
            case 'protected':
                player.protected = value;
                this.addToLog(`${player.name} ${value ? 'защищен' : 'больше не защищен'}`, 'player');
                break;
            default:
                console.error(`Неизвестное состояние: ${state}`);
                return null;
        }
        
        // Вызываем событие для обновления UI
        const event = new CustomEvent('game:playerUpdated', {
            detail: { player: player }
        });
        document.dispatchEvent(event);
        
        return player;
    }
    
    /**
     * Получает счетчик игроков по ролям
     * @returns {Object} Счетчик игроков
     */
    getPlayerCounts() {
        // Количество игроков
        const playerCount = this.players.length;
        
        // Расчет количества ролей в зависимости от количества игроков
        let townfolkCount, outsiderCount, minionCount, demonCount;
        
        switch(playerCount) {
            case 5:
                townfolkCount = 3;
                outsiderCount = 0;
                minionCount = 1;
                demonCount = 1;
                break;
            case 6:
                townfolkCount = 3;
                outsiderCount = 1;
                minionCount = 1;
                demonCount = 1;
                break;
            case 7:
                townfolkCount = 5;
                outsiderCount = 0;
                minionCount = 1;
                demonCount = 1;
                break;
            case 8:
                townfolkCount = 5;
                outsiderCount = 1;
                minionCount = 1;
                demonCount = 1;
                break;
            case 9:
                townfolkCount = 5;
                outsiderCount = 2;
                minionCount = 1;
                demonCount = 1;
                break;
            case 10:
                townfolkCount = 7;
                outsiderCount = 0;
                minionCount = 2;
                demonCount = 1;
                break;
            case 11:
                townfolkCount = 7;
                outsiderCount = 1;
                minionCount = 2;
                demonCount = 1;
                break;
            case 12:
                townfolkCount = 7;
                outsiderCount = 2;
                minionCount = 2;
                demonCount = 1;
                break;
            case 13:
                townfolkCount = 9;
                outsiderCount = 0;
                minionCount = 3;
                demonCount = 1;
                break;
            case 14:
                townfolkCount = 9;
                outsiderCount = 1;
                minionCount = 3;
                demonCount = 1;
                break;
            case 15:
                townfolkCount = 9;
                outsiderCount = 2;
                minionCount = 3;
                demonCount = 1;
                break;
            default:
                // Для большего количества игроков
                if (playerCount > 15) {
                    townfolkCount = Math.floor(playerCount * 0.6);
                    outsiderCount = Math.floor(playerCount * 0.15);
                    minionCount = Math.floor(playerCount * 0.2);
                    demonCount = Math.floor(playerCount * 0.05) || 1; // Всегда минимум 1 демон
                }
                // Для меньшего количества (на всякий случай)
                else {
                    townfolkCount = 3;
                    outsiderCount = 0;
                    minionCount = 1;
                    demonCount = 1;
                }
        }
        
        return {
            total: playerCount,
            townfolk: townfolkCount,
            outsiders: outsiderCount,
            minions: minionCount,
            demons: demonCount,
            good: townfolkCount + outsiderCount,
            evil: minionCount + demonCount
        };
    }
    
    /**
     * Получает список живых игроков
     * @returns {Array} Список живых игроков
     */
    getAlivePlayers() {
        return this.players.filter(player => player.alive);
    }
    
    /**
     * Получает список мертвых игроков
     * @returns {Array} Список мертвых игроков
     */
    getDeadPlayers() {
        return this.players.filter(player => !player.alive);
    }
    
    /**
     * Получает игрока по ID
     * @param {number} playerId ID игрока
     * @returns {Object|null} Игрок или null при ошибке
     */
    getPlayerById(playerId) {
        return this.players.find(p => p.id === playerId) || null;
    }
    
    /**
     * Экспортирует состояние игры для сохранения
     * @returns {Object} Состояние игры
     */
    exportGameState() {
        return {
            players: JSON.parse(JSON.stringify(this.players)),
            isNight: this.isNight,
            currentDay: this.currentDay,
            activeScenario: this.activeScenario,
            eventLog: JSON.parse(JSON.stringify(this.eventLog))
        };
    }
    
    /**
     * Импортирует состояние игры для загрузки
     * @param {Object} gameState Состояние игры
     * @returns {boolean} Успешность загрузки
     */
    importGameState(gameState) {
        if (!gameState || typeof gameState !== 'object') {
            console.error('Неверный формат состояния игры');
            return false;
        }
        
        try {
            this.players = gameState.players || [];
            this.isNight = gameState.isNight || false;
            this.currentDay = gameState.currentDay || 1;
            this.activeScenario = gameState.activeScenario || 'trouble_brewing';
            this.eventLog = gameState.eventLog || [];
            
            // Добавляем запись в журнал
            this.addToLog('Игра загружена из сохранения', 'system');
            
            // Вызываем события для обновления UI
            const gameEvent = new CustomEvent('game:stateLoaded', {
                detail: { gameState: this.exportGameState() }
            });
            document.dispatchEvent(gameEvent);
            
            return true;
        } catch (error) {
            console.error('Ошибка при загрузке состояния игры:', error);
            return false;
        }
    }
}

// Экспортируем класс Game
window.Game = Game; 