// Скрипт для страницы с описанием ролей

document.addEventListener('DOMContentLoaded', function() {
    let currentScenario = 'Неприятности назревают';
    const modal = document.getElementById('role-modal');
    const closeBtn = document.querySelector('.role-modal-close');
    const searchInput = document.getElementById('role-search');
    
    console.log('Загружен скрипт roles.js');
    console.log('Доступные сценарии:', SCENARIOS);
    
    // Отрисовка начальных карточек ролей
    console.log('Отображаем роли для сценария:', currentScenario);
    renderRoles(currentScenario);
    
    // Обработчик поиска ролей
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterRoles(searchTerm, currentScenario);
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Функция отрисовки карточек ролей для выбранного сценария
    function renderRoles(scenarioKey) {
        // Получаем данные о ролях для выбранного сценария
        const roles = getScenarioRoles(scenarioKey);
        console.log('Получены роли для сценария', scenarioKey, ':', roles);
        
        // Очищаем текущее содержимое
        document.querySelectorAll('.roles-grid').forEach(grid => grid.innerHTML = '');
        
        // Если ролей нет, выводим сообщение и останавливаемся
        if (!roles || roles.length === 0) {
            console.error('Нет данных о ролях для сценария', scenarioKey);
            document.querySelectorAll('.roles-grid').forEach(grid => {
                grid.innerHTML = '<div class="error-message">Нет данных о ролях для этого сценария</div>';
            });
            return;
        }
        
        // Сортировка ролей по категориям
        const townfolkRoles = roles.filter(role => role.type === 'Горожанин');
        const outsiderRoles = roles.filter(role => role.type === 'Чужак');
        const minionRoles = roles.filter(role => role.type === 'Прислужник');
        const demonRoles = roles.filter(role => role.type === 'Демон');
        
        console.log('Горожане:', townfolkRoles);
        console.log('Чужаки:', outsiderRoles);
        console.log('Прислужники:', minionRoles);
        console.log('Демоны:', demonRoles);
        
        // Отображение ролей по категориям
        renderCategoryCards(townfolkRoles, document.getElementById('townfolk-grid'));
        renderCategoryCards(outsiderRoles, document.getElementById('outsider-grid'));
        renderCategoryCards(minionRoles, document.getElementById('minion-grid'));
        renderCategoryCards(demonRoles, document.getElementById('demon-grid'));
    }
    
    // Функция получения ролей из выбранного сценария
    function getScenarioRoles(scenarioKey) {
        try {
            // Получаем данные сценария
            if (!window.SCENARIOS) {
                console.error('SCENARIOS не определен в глобальной области!');
                return [];
            }
            
            const scenario = window.SCENARIOS[scenarioKey] || {};
            console.log('Данные сценария:', scenario);
            
            if (!scenario || Object.keys(scenario).length === 0) {
                console.error('Сценарий не найден:', scenarioKey);
                return [];
            }
            
            // Соберем все роли из различных категорий
            const allRoles = [];
            
            // Добавляем горожан
            if (scenario.good && Array.isArray(scenario.good)) {
                allRoles.push(...scenario.good.map(role => ({
                    ...role,
                    type: 'Горожанин',
                    team: 'Добрый',
                    category: role.category || 'Информация'
                })));
            }
            
            // Добавляем чужаков
            if (scenario.outsiders && Array.isArray(scenario.outsiders)) {
                allRoles.push(...scenario.outsiders.map(role => ({
                    ...role,
                    type: 'Чужак',
                    team: 'Добрый',
                    category: role.category || 'Саботаж'
                })));
            }
            
            // Добавляем прислужников
            if (scenario.minions && Array.isArray(scenario.minions)) {
                allRoles.push(...scenario.minions.map(role => ({
                    ...role,
                    type: 'Прислужник',
                    team: 'Злой',
                    category: role.category || 'Обман'
                })));
            }
            
            // Добавляем демонов
            if (scenario.demons && Array.isArray(scenario.demons)) {
                allRoles.push(...scenario.demons.map(role => ({
                    ...role,
                    type: 'Демон',
                    team: 'Злой',
                    category: role.category || 'Убийство'
                })));
            }
            
            console.log('Все роли:', allRoles);
            return allRoles;
        } catch (error) {
            console.error('Ошибка при получении ролей:', error);
            return [];
        }
    }
    
    // Функция отрисовки карточек для определенной категории
    function renderCategoryCards(roles, container) {
        if (!container) {
            console.error('Контейнер не найден');
            return;
        }
        
        if (!roles || roles.length === 0) {
            container.innerHTML = '<div class="no-roles-message">Нет ролей в этой категории</div>';
            return;
        }
        
        roles.forEach(role => {
            try {
                // Создаем элемент карточки
                const card = document.createElement('div');
                
                // Определяем CSS-классы для карточки
                const alignmentClass = role.team === 'Добрый' ? 'good' : 'evil';
                card.className = `role-card ${alignmentClass} expanded-card`;
                
                // Создаем метку команды
                const teamTag = `<span class="role-type-tag ${alignmentClass === 'good' ? 'good-tag' : 'evil-tag'}">${role.team}</span>`;
                
                // Создаем метку категории
                const categoryClass = getCategoryClass(role.category);
                const categoryTag = `<span class="role-category-tag ${categoryClass}">${role.category}</span>`;
                
                // Создаем метку роли
                const roleTeamTag = `<span class="role-team-tag">${role.type}</span>`;
                
                // Собираем теги времени
                const timingTags = [];
                if (role.firstNight) {
                    timingTags.push('<span class="timing-tag first-night active">Первая ночь</span>');
                }
                
                if (role.otherNight) {
                    timingTags.push('<span class="timing-tag other-night active">Другие ночи</span>');
                }
                
                if (role.passive) {
                    timingTags.push('<span class="timing-tag passive active">Пассивно</span>');
                }
                
                // Устанавливаем содержимое карточки
                card.innerHTML = `
                    <div class="role-header">
                        <h3 class="role-name">${role.name}</h3>
                        ${teamTag}
                    </div>
                    <div class="role-body">
                        <div>
                            ${roleTeamTag}
                            ${categoryTag}
                        </div>
                        <div class="role-timing-tags">
                            ${timingTags.join('')}
                        </div>
                        <div class="role-ability-container">
                            <h4 class="role-ability-title">Способность:</h4>
                            <p class="role-ability">${role.ability || 'Нет описания'}</p>
                        </div>
                    </div>
                `;
                
                // Добавляем карточку в контейнер
                container.appendChild(card);
            } catch (error) {
                console.error('Ошибка при создании карточки роли:', error, role);
            }
        });
    }
    
    // Функция для определения CSS-класса категории
    function getCategoryClass(category) {
        const categoryMap = {
            'Информация': 'category-information',
            'Защита': 'category-protection',
            'Сила': 'category-power',
            'Проклятие': 'category-jinx',
            'Обман': 'category-deception',
            'Убийство': 'category-killing',
            'Опасность': 'category-danger',
            'Саботаж': 'category-sabotage',
            'Подготовка': 'category-setup'
        };
        
        return categoryMap[category] || '';
    }
    
    // Функция для фильтрации ролей по поисковому запросу
    function filterRoles(searchTerm, scenarioKey) {
        const roles = getScenarioRoles(scenarioKey);
        
        if (!roles || roles.length === 0) return;
        
        const cards = document.querySelectorAll('.role-card');
        let hasVisibleRoles = false;
        
        cards.forEach(card => {
            const roleName = card.querySelector('.role-name').textContent.toLowerCase();
            const roleAbility = card.querySelector('.role-ability').textContent.toLowerCase();
            const roleCategory = card.querySelector('.role-category-tag').textContent.toLowerCase();
            
            if (roleName.includes(searchTerm) || 
                roleAbility.includes(searchTerm) || 
                roleCategory.includes(searchTerm)) {
                card.style.display = 'block';
                hasVisibleRoles = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Проверяем, есть ли видимые карточки в каждой категории
        document.querySelectorAll('.role-category').forEach(section => {
            const sectionId = section.id;
            const sectionCards = section.querySelectorAll('.role-card');
            const visibleCards = Array.from(sectionCards).filter(card => card.style.display !== 'none');
            
            // Если нет видимых карточек в категории, показываем сообщение
            const grid = section.querySelector('.roles-grid');
            const noRolesMsg = section.querySelector('.no-roles-message') || document.createElement('div');
            noRolesMsg.className = 'no-roles-message';
            noRolesMsg.textContent = 'Нет ролей, соответствующих запросу';
            
            if (visibleCards.length === 0) {
                // Если в категории нет сообщения о пустом результате, добавляем его
                if (!section.querySelector('.no-roles-message')) {
                    grid.appendChild(noRolesMsg);
                }
                noRolesMsg.style.display = 'block';
            } else {
                // Если есть видимые карточки, скрываем сообщение
                if (section.querySelector('.no-roles-message')) {
                    noRolesMsg.style.display = 'none';
                }
            }
        });
    }
    
    // Функция открытия модального окна с детальной информацией о роли
    function openRoleModal(role) {
        if (!role) return;
        
        // Заполняем информацию о роли
        document.querySelector('.role-modal-title').textContent = role.name;
        document.querySelector('.role-modal-alignment').textContent = role.team;
        document.querySelector('.role-modal-alignment').className = `role-modal-alignment ${role.team === 'Добрый' ? 'good' : 'evil'}`;
        document.querySelector('.role-modal-category').textContent = `${role.type} - ${role.category}`;
        document.querySelector('.role-modal-ability').textContent = role.ability || 'Нет описания';
        
        // Настраиваем видимость тегов времени
        document.querySelector('.timing-tag.first-night').classList.toggle('active', role.firstNight);
        document.querySelector('.timing-tag.other-night').classList.toggle('active', role.otherNight);
        document.querySelector('.timing-tag.passive').classList.toggle('active', role.passive);
        
        // Показываем модальное окно
        modal.style.display = 'flex';
    }
}); 