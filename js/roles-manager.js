/**
 * Модуль для управления выбором и назначением ролей
 */
document.addEventListener('DOMContentLoaded', function() {
    initRoleAssignmentHandlers();
    addDebugRoleButton();
});

/**
 * Инициализирует обработчики для выбора способа назначения ролей
 */
function initRoleAssignmentHandlers() {
    // Обработчики для радио-кнопок выбора режима назначения ролей
    document.querySelectorAll('input[name="roles-assignment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const manualContainer = document.getElementById('manual-roles-container');
            const semiManualContainer = document.getElementById('semi-manual-roles-container');
            
            // Скрываем оба контейнера по умолчанию
            manualContainer.style.display = 'none';
            semiManualContainer.style.display = 'none';
            
            // Показываем соответствующий контейнер в зависимости от выбора
            if (this.value === 'manual') {
                manualContainer.style.display = 'block';
                updatePlayerRolesSelection();
            } else if (this.value === 'semi-manual') {
                semiManualContainer.style.display = 'block';
                updateRoleSelectionList();
            }
        });
    });

    // Обработчики для обновления списка игроков при добавлении/удалении игрока
    document.getElementById('add-player').addEventListener('click', function() {
        // После добавления игрока обновляем списки выбора ролей
        const roleAssignmentMode = document.querySelector('input[name="roles-assignment"]:checked').value;
        
        setTimeout(() => {
            if (roleAssignmentMode === 'manual') {
                updatePlayerRolesSelection();
            } else if (roleAssignmentMode === 'semi-manual') {
                updateRequiredRolesCount();
            }
        }, 10);
    });
    
    // Обработчик для удаления игроков
    document.getElementById('players-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-player-btn')) {
            // После удаления игрока обновляем списки выбора ролей
            const roleAssignmentMode = document.querySelector('input[name="roles-assignment"]:checked').value;
            
            setTimeout(() => {
                if (roleAssignmentMode === 'manual') {
                    updatePlayerRolesSelection();
                } else if (roleAssignmentMode === 'semi-manual') {
                    updateRequiredRolesCount();
                }
            }, 10);
        }
    });
}

/**
 * Добавляет кнопку отладки в контейнер выбора ролей
 */
function addDebugRoleButton() {
    const container = document.getElementById('semi-manual-roles-container');
    if (container) {
        const debugButton = document.createElement('button');
        debugButton.id = 'debug-roles-button';
        debugButton.type = 'button';
        debugButton.className = 'btn';
        debugButton.textContent = 'Проверить выбранные роли';
        debugButton.style.marginTop = '10px';
        debugButton.addEventListener('click', debugRoleSelection);
        
        container.appendChild(debugButton);
    }
}

/**
 * Функция для отображения информации о выбранных ролях (для отладки)
 */
function debugRoleSelection() {
    // Получаем все выбранные роли
    const selectedCheckboxes = document.querySelectorAll('.role-checkbox:checked');
    const selectedRoles = Array.from(selectedCheckboxes).map(checkbox => {
        return {
            id: checkbox.dataset.roleId,
            name: checkbox.dataset.roleName || checkbox.nextElementSibling.textContent
        };
    });
    
    console.log("=== ОТЛАДКА ВЫБОРА РОЛЕЙ ===");
    console.log(`Выбрано ${selectedRoles.length} ролей:`);
    selectedRoles.forEach((role, idx) => {
        console.log(`${idx + 1}. ${role.name} (ID: ${role.id})`);
    });
    
    alert(`Выбрано ${selectedRoles.length} ролей. Подробную информацию смотрите в консоли (F12)`);
}

/**
 * Обновляет список выбора ролей для полуручного режима
 */
function updateRoleSelectionList() {
    const container = document.getElementById('role-selection-container');
    const scenario = document.getElementById('scenario-select').value;
    const scenarioData = window.SCENARIOS[scenario];
    
    // Очистка контейнера
    container.innerHTML = '';
    
    // Добавляем группы ролей
    const categories = [
        { name: 'good', title: 'Горожане', roles: scenarioData.good },
        { name: 'outsiders', title: 'Чужаки', roles: scenarioData.outsiders },
        { name: 'minions', title: 'Миньоны', roles: scenarioData.minions },
        { name: 'demons', title: 'Демоны', roles: scenarioData.demons }
    ];
    
    // Для каждой категории создаем группу с чекбоксами
    categories.forEach(category => {
        const group = document.createElement('div');
        group.className = 'role-selection-group';
        
        const heading = document.createElement('h5');
        heading.textContent = category.title;
        group.appendChild(heading);
        
        const checkboxes = document.createElement('div');
        checkboxes.className = 'role-checkboxes';
        
        // Добавляем чекбоксы для каждой роли
        category.roles.forEach(role => {
            const item = document.createElement('div');
            item.className = 'role-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'role-checkbox';
            checkbox.id = `role-${role.id}`;
            checkbox.dataset.roleId = String(role.id); // Важно преобразовать ID в строку
            checkbox.dataset.roleName = role.name;
            
            checkbox.addEventListener('change', function() {
                updateSelectedRolesCount();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `role-${role.id}`;
            label.textContent = role.name;
            
            item.appendChild(checkbox);
            item.appendChild(label);
            checkboxes.appendChild(item);
        });
        
        group.appendChild(checkboxes);
        container.appendChild(group);
    });
    
    // Обновляем счетчики ролей
    updateSelectedRolesCount();
    updateRequiredRolesCount();
}

/**
 * Обновляет счетчик выбранных ролей
 */
function updateSelectedRolesCount() {
    const checkboxes = document.querySelectorAll('.role-checkbox:checked');
    const selectedCount = checkboxes.length;
    const countElement = document.getElementById('selected-roles-count');
    
    if (countElement) {
        countElement.textContent = selectedCount.toString();
        
        // Получаем требуемое количество ролей
        const requiredCount = parseInt(document.getElementById('required-roles-count').textContent);
        
        // Меняем цвет в зависимости от соответствия количества
        if (selectedCount === requiredCount) {
            countElement.style.color = '#90ee90'; // зеленый
        } else if (selectedCount > requiredCount) {
            countElement.style.color = '#ff6347'; // красный
        } else {
            countElement.style.color = '#eee8aa'; // желтый
        }
    }
}

/**
 * Обновляет счетчик требуемых ролей
 */
function updateRequiredRolesCount() {
    const playerCount = document.querySelectorAll('.player-name-input').length;
    const countElement = document.getElementById('required-roles-count');
    
    if (countElement) {
        countElement.textContent = playerCount.toString();
    }
}

/**
 * Обновляет выпадающие списки ролей при изменении списка игроков (для ручного режима)
 */
function updatePlayerRolesSelection() {
    const ui = window.ui || getUIInstance();
    const container = document.getElementById('player-roles-selection');
    const scenario = document.getElementById('scenario-select').value;
    const playerInputs = document.querySelectorAll('.player-name-input');
    
    // Очистка контейнера
    container.innerHTML = '';
    
    // Получение всех ролей из сценария
    const scenarioData = window.SCENARIOS[scenario];
    if (!scenarioData) {
        console.error('Ошибка загрузки сценария:', scenario);
        return;
    }
    
    // Объединение всех ролей в один массив
    const allRoles = [
        ...scenarioData.good.map(role => ({ ...role, category: 'good' })),
        ...scenarioData.outsiders.map(role => ({ ...role, category: 'outsiders' })),
        ...scenarioData.minions.map(role => ({ ...role, category: 'minions' })),
        ...scenarioData.demons.map(role => ({ ...role, category: 'demons' }))
    ];
    
    // Для каждого игрока создаем выпадающий список ролей
    playerInputs.forEach((input, index) => {
        const playerName = input.value.trim() || `Игрок ${index + 1}`;
        
        const row = document.createElement('div');
        row.className = 'player-role-assignment';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = playerName;
        row.appendChild(nameSpan);
        
        const select = document.createElement('select');
        select.className = 'player-role-select';
        select.dataset.playerId = index.toString();
        
        // Добавление пустого выбора
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Выберите роль --';
        select.appendChild(emptyOption);
        
        // Добавление категорий ролей
        const categories = [
            { name: 'good', title: 'Горожане' },
            { name: 'outsiders', title: 'Чужаки' },
            { name: 'minions', title: 'Миньоны' },
            { name: 'demons', title: 'Демоны' }
        ];
        
        categories.forEach(category => {
            const group = document.createElement('optgroup');
            group.label = category.title;
            
            const categoryRoles = allRoles.filter(role => role.category === category.name);
            
            categoryRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                group.appendChild(option);
            });
            
            select.appendChild(group);
        });
        
        row.appendChild(select);
        container.appendChild(row);
    });
}

/**
 * Функция для полуручного режима назначения ролей
 * Назначает выбранные роли игрокам в случайном порядке
 * @returns {boolean} Успешность операции
 */
function assignSemiManualRoles() {
    const ui = window.ui || getUIInstance();
    const playerCount = ui.game.players.length;
    
    // 1. Получаем выбранные чекбоксы и их ID
    const selectedCheckboxes = document.querySelectorAll('.role-checkbox:checked');
    const selectedRoleIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.roleId);
    
    // Базовые проверки
    if (selectedRoleIds.length === 0) {
        alert('Не выбрано ни одной роли. Пожалуйста, выберите роли для игры.');
        return false;
    }
    
    if (selectedRoleIds.length !== playerCount) {
        alert(`Количество выбранных ролей (${selectedRoleIds.length}) не совпадает с количеством игроков (${playerCount}). Пожалуйста, выберите ${playerCount} ролей.`);
        return false;
    }
    
    // 2. Получаем выбранный сценарий
    const scenario = document.getElementById('scenario-select').value;
    
    // 3. Получаем все роли из сценария
    const scenarioData = window.SCENARIOS[scenario];
    if (!scenarioData) {
        alert(`Ошибка: сценарий ${scenario} не найден`);
        return false;
    }
    
    // 4. Создаем единый массив всех ролей для поиска
    const allCategoryRoles = {
        good: scenarioData.good || [],
        outsiders: scenarioData.outsiders || [],
        minions: scenarioData.minions || [],
        demons: scenarioData.demons || []
    };
    
    // 5. Находим роли по ID
    const selectedRoles = [];
    const notFoundRoles = [];
    
    for (const roleId of selectedRoleIds) {
        let foundRole = null;
        let foundCategory = null;
        
        // Ищем в каждой категории
        for (const category in allCategoryRoles) {
            const roles = allCategoryRoles[category];
            
            for (const role of roles) {
                if (String(role.id) === String(roleId)) {
                    foundRole = role;
                    foundCategory = category;
                    break;
                }
            }
            
            if (foundRole) break;
        }
        
        if (foundRole) {
            // Добавляем информацию о категории
            foundRole._category = foundCategory;
            selectedRoles.push(foundRole);
        } else {
            notFoundRoles.push(roleId);
        }
    }
    
    // 6. Проверяем результаты поиска
    if (selectedRoles.length !== selectedRoleIds.length) {
        const errorMsg = `Ошибка: найдено только ${selectedRoles.length} ролей из ${selectedRoleIds.length} выбранных. Не найдены ID: ${notFoundRoles.join(', ')}`;
        console.error(errorMsg);
        alert(errorMsg);
        return false;
    }
    
    // 7. Перемешиваем роли и назначаем игрокам
    const shuffledRoles = shuffleArray(selectedRoles);
    
    // 8. Назначаем роли игрокам
    ui.game.players.forEach((player, index) => {
        if (index < shuffledRoles.length) {
            const role = shuffledRoles[index];
            player.character = role;
            
            // Определяем выравнивание на основе категории роли
            player.alignment = (role._category === 'good' || role._category === 'outsiders') ? 'good' : 'evil';
        }
    });
    
    return true;
}

/**
 * Перемешивает массив (алгоритм Фишера-Йейтса)
 * @param {Array} array Исходный массив
 * @returns {Array} Перемешанный массив
 */
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Получает экземпляр UI
 * @returns {Object} Экземпляр UI
 */
function getUIInstance() {
    if (!window.ui) {
        console.warn('UI не инициализирован. Создаем новый экземпляр.');
        window.ui = new UI();
    }
    return window.ui;
}

// Экспортируем функции для использования в других модулях
window.assignSemiManualRoles = assignSemiManualRoles;
window.updateRoleSelectionList = updateRoleSelectionList;
window.updateSelectedRolesCount = updateSelectedRolesCount;
window.updateRequiredRolesCount = updateRequiredRolesCount;
window.updatePlayerRolesSelection = updatePlayerRolesSelection; 