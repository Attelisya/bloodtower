/**
 * Модуль для управления модальными окнами
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeModalHandlers();
});

/**
 * Инициализирует обработчики для модальных окон
 */
function initializeModalHandlers() {
    // Инициализируем обработчики для модального окна управления игроком
    initPlayerModalHandlers();
    
    // Инициализируем обработчики для модального окна "О игре"
    initAboutModalHandlers();
}

/**
 * Инициализирует обработчики для модального окна управления игроком
 */
function initPlayerModalHandlers() {
    const playerModal = document.getElementById('player-modal');
    const closePlayerModalBtn = document.getElementById('close-player-modal');
    
    if (closePlayerModalBtn) {
        closePlayerModalBtn.addEventListener('click', function() {
            hideModal(playerModal);
        });
    }
    
    // Закрытие модального окна по клику вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === playerModal) {
            hideModal(playerModal);
        }
    });
    
    // Инициализация кнопок управления статусами игрока
    const toggleDeadBtn = document.getElementById('toggle-dead');
    const togglePoisonedBtn = document.getElementById('toggle-poisoned');
    const toggleDrunkBtn = document.getElementById('toggle-drunk');
    const toggleProtectedBtn = document.getElementById('toggle-protected');
    
    if (toggleDeadBtn) {
        toggleDeadBtn.addEventListener('click', function() {
            const playerId = Number(this.dataset.playerId);
            const player = window.ui.game.getPlayerById(playerId);
            
            if (player) {
                window.ui.updatePlayerState(playerId, 'alive', !player.alive);
                
                // Обновляем текст кнопки
                this.textContent = player.alive ? 'Убить' : 'Воскресить';
                
                // Логируем действие
                window.ui.addToLog(`${player.name} ${player.alive ? 'умер' : 'воскрешен'}`, 'player');
                
                // Закрываем модальное окно
                hideModal(playerModal);
            }
        });
    }
    
    if (togglePoisonedBtn) {
        togglePoisonedBtn.addEventListener('click', function() {
            const playerId = Number(this.dataset.playerId);
            const player = window.ui.game.getPlayerById(playerId);
            
            if (player) {
                window.ui.updatePlayerState(playerId, 'poisoned', !player.poisoned);
                
                // Обновляем текст кнопки
                this.textContent = player.poisoned ? 'Вылечить' : 'Отравить';
                
                // Логируем действие
                window.ui.addToLog(`${player.name} ${player.poisoned ? 'отравлен' : 'вылечен от яда'}`, 'player');
                
                // Закрываем модальное окно
                hideModal(playerModal);
            }
        });
    }
    
    if (toggleDrunkBtn) {
        toggleDrunkBtn.addEventListener('click', function() {
            const playerId = Number(this.dataset.playerId);
            const player = window.ui.game.getPlayerById(playerId);
            
            if (player) {
                window.ui.updatePlayerState(playerId, 'drunk', !player.drunk);
                
                // Обновляем текст кнопки
                this.textContent = player.drunk ? 'Отрезвить' : 'Опьянить';
                
                // Логируем действие
                window.ui.addToLog(`${player.name} ${player.drunk ? 'опьянен' : 'отрезвлен'}`, 'player');
                
                // Закрываем модальное окно
                hideModal(playerModal);
            }
        });
    }
    
    if (toggleProtectedBtn) {
        toggleProtectedBtn.addEventListener('click', function() {
            const playerId = Number(this.dataset.playerId);
            const player = window.ui.game.getPlayerById(playerId);
            
            if (player) {
                window.ui.updatePlayerState(playerId, 'protected', !player.protected);
                
                // Обновляем текст кнопки
                this.textContent = player.protected ? 'Снять защиту' : 'Защитить';
                
                // Логируем действие
                window.ui.addToLog(`${player.name} ${player.protected ? 'защищен' : 'больше не защищен'}`, 'player');
                
                // Закрываем модальное окно
                hideModal(playerModal);
            }
        });
    }
}

/**
 * Инициализирует обработчики для модального окна "О игре"
 */
function initAboutModalHandlers() {
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModalBtn = document.getElementById('close-about-modal');
    const aboutGameBtn = document.getElementById('about-game');
    
    if (aboutGameBtn) {
        aboutGameBtn.addEventListener('click', function() {
            showModal(aboutModal);
        });
    }
    
    if (closeAboutModalBtn) {
        closeAboutModalBtn.addEventListener('click', function() {
            hideModal(aboutModal);
        });
    }
    
    // Закрытие модального окна по клику вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === aboutModal) {
            hideModal(aboutModal);
        }
    });
}

/**
 * Открывает модальное окно управления игроком
 * @param {Object} player Игрок
 */
function openPlayerModal(player) {
    if (!player) return;
    
    const modalElement = document.getElementById('player-modal');
    const titleElement = document.getElementById('player-modal-title');
    const roleElement = document.getElementById('player-modal-role');
    const alignmentElement = document.getElementById('player-modal-alignment');
    const abilityElement = document.getElementById('player-modal-ability');
    
    // Кнопки управления статусами
    const toggleDeadBtn = document.getElementById('toggle-dead');
    const togglePoisonedBtn = document.getElementById('toggle-poisoned');
    const toggleDrunkBtn = document.getElementById('toggle-drunk');
    const toggleProtectedBtn = document.getElementById('toggle-protected');
    
    // Заполняем информацию игрока
    titleElement.textContent = player.name;
    roleElement.textContent = player.character ? player.character.name : '—';
    
    if (player.alignment) {
        alignmentElement.textContent = player.alignment === 'good' ? 'Добрая' : 'Злая';
    } else {
        alignmentElement.textContent = '—';
    }
    
    abilityElement.textContent = player.character ? player.character.ability : '—';
    
    // Обновляем тексты кнопок
    toggleDeadBtn.textContent = player.alive ? 'Убить' : 'Воскресить';
    togglePoisonedBtn.textContent = player.poisoned ? 'Вылечить' : 'Отравить';
    toggleDrunkBtn.textContent = player.drunk ? 'Отрезвить' : 'Опьянить';
    toggleProtectedBtn.textContent = player.protected ? 'Снять защиту' : 'Защитить';
    
    // Присваиваем ID игрока кнопкам
    toggleDeadBtn.dataset.playerId = player.id;
    togglePoisonedBtn.dataset.playerId = player.id;
    toggleDrunkBtn.dataset.playerId = player.id;
    toggleProtectedBtn.dataset.playerId = player.id;
    
    // Показываем модальное окно
    showModal(modalElement);
}

/**
 * Показывает модальное окно
 * @param {HTMLElement|string} modal Элемент модального окна или его ID
 */
function showModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Скрывает модальное окно
 * @param {HTMLElement|string} modal Элемент модального окна или его ID
 */
function hideModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        modal.style.display = 'none';
    }
}

// Экспортируем функции для использования в других модулях
window.openPlayerModal = openPlayerModal;
window.showModal = showModal;
window.hideModal = hideModal; 