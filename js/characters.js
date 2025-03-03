// Данные о персонажах для разных сценариев игры

const CHARACTERS = {
    // Сценарий "Неприятности назревают"
    'trouble-brewing': {
        // Добрые персонажи (Горожане)
        good: [
            {
                id: 'washerwoman',
                name: 'Прачка',
                ability: 'В первую ночь вам показывают двух игроков, один из которых является указанным горожанином.',
                firstNight: true,
                otherNight: false,
                category: 'information'
            },
            {
                id: 'librarian',
                name: 'Библиотекарь',
                ability: 'В первую ночь вам показывают двух игроков, один из которых является указанным чужаком.',
                firstNight: true,
                otherNight: false,
                category: 'information'
            },
            {
                id: 'investigator',
                name: 'Следователь',
                ability: 'В первую ночь вам показывают двух игроков, один из которых является указанным миньоном.',
                firstNight: true,
                otherNight: false,
                category: 'information'
            },
            {
                id: 'chef',
                name: 'Шеф-повар',
                ability: 'В первую ночь вы узнаёте, сколько пар злых игроков сидят рядом друг с другом.',
                firstNight: true,
                otherNight: false,
                category: 'information'
            },
            {
                id: 'empath',
                name: 'Эмпат',
                ability: 'Каждую ночь вы узнаёте, сколько из ваших соседей (сидящих рядом с вами игроков) являются злыми.',
                firstNight: true,
                otherNight: true,
                category: 'information'
            },
            {
                id: 'fortune-teller',
                name: 'Гадалка',
                ability: 'Каждую ночь вы можете выбрать двух игроков: вам скажут, является ли хотя бы один из них демоном. Один добрый игрок всегда будет выглядеть как демон.',
                firstNight: true,
                otherNight: true,
                category: 'information'
            },
            {
                id: 'undertaker',
                name: 'Гробовщик',
                ability: 'Каждую ночь, кроме первой, вам сообщают, какой персонаж был казнён днём.',
                firstNight: false,
                otherNight: true,
                category: 'information'
            },
            {
                id: 'monk',
                name: 'Монах',
                ability: 'Каждую ночь, кроме первой, вы можете выбрать другого игрока (не себя): он не может быть убит демоном этой ночью.',
                firstNight: false,
                otherNight: true,
                category: 'protection'
            },
            {
                id: 'ravenkeeper',
                name: 'Хранитель воронов',
                ability: 'Если вы умираете ночью, вы просыпаетесь и можете выбрать одного игрока, чтобы узнать его роль.',
                firstNight: false,
                otherNight: false,
                deathAbility: true,
                category: 'information'
            },
            {
                id: 'virgin',
                name: 'Дева',
                ability: 'Если горожанин впервые номинирует вас на казнь, он немедленно умирает. После этого может произойти ещё одна казнь в этот день.',
                firstNight: false,
                otherNight: false,
                category: 'power'
            },
            {
                id: 'slayer',
                name: 'Истребитель демонов',
                ability: 'Один раз в игру днём вы можете публично выбрать игрока: если он демон, он умирает.',
                firstNight: false,
                otherNight: false,
                category: 'power'
            },
            {
                id: 'soldier',
                name: 'Солдат',
                ability: 'Вы невосприимчивы к атакам демона – вы не можете быть убиты им.',
                firstNight: false,
                otherNight: false,
                passive: true,
                category: 'protection'
            },
            {
                id: 'mayor',
                name: 'Мэр',
                ability: 'Если осталось только 3 живых игрока и нет выполненной казни, ваша команда побеждает.',
                firstNight: false,
                otherNight: false,
                passive: true,
                category: 'power'
            }
        ],
        
        // Добрые персонажи (Чужаки)
        outsiders: [
            {
                id: 'butler',
                name: 'Дворецкий',
                ability: 'Каждую ночь вы выбираете игрока (не себя): вы можете голосовать только так же, как этот игрок, на следующий день.',
                firstNight: true,
                otherNight: true,
                category: 'jinx'
            },
            {
                id: 'drunk',
                name: 'Пьяница',
                ability: 'Вы думаете, что вы горожанин, но это не так. Вы не знаете, что вы пьяница. Рассказчик использует вашу горожанскую способность как будто вы этот персонаж.',
                firstNight: false,
                otherNight: false,
                passive: true,
                secret: true,
                category: 'jinx'
            },
            {
                id: 'recluse',
                name: 'Отшельник',
                ability: 'Вы можете казаться злым или демоном для других игроков и их способностей.',
                firstNight: false,
                otherNight: false,
                passive: true,
                category: 'deception'
            },
            {
                id: 'saint',
                name: 'Святой',
                ability: 'Если вас казнят, ваша команда проигрывает.',
                firstNight: false,
                otherNight: false,
                passive: true,
                category: 'danger'
            }
        ],
        
        // Злые персонажи (Миньоны)
        minions: [
            {
                id: 'poisoner',
                name: 'Отравитель',
                ability: 'Каждую ночь вы выбираете игрока: его способность не работает или даёт ложную информацию до следующей ночи.',
                firstNight: true,
                otherNight: true,
                category: 'sabotage'
            },
            {
                id: 'spy',
                name: 'Шпион',
                ability: 'Каждую ночь вы видите Гримуар рассказчика, который показывает, кто является каким персонажем.',
                firstNight: true,
                otherNight: true,
                category: 'information'
            },
            {
                id: 'scarlet-woman',
                name: 'Алая женщина',
                ability: 'Если в игре 5 или больше живых игроков и демон умирает, вы становитесь демоном.',
                firstNight: false,
                otherNight: false,
                passive: true,
                category: 'power'
            },
            {
                id: 'baron',
                name: 'Барон',
                ability: 'В игре присутствуют на 2 чужака больше, чем должно было быть в этой игре.',
                firstNight: false,
                otherNight: false,
                passive: true,
                setup: true,
                category: 'setup'
            }
        ],
        
        // Злые персонажи (Демоны)
        demons: [
            {
                id: 'imp',
                name: 'Бес',
                ability: 'Каждую ночь вы выбираете игрока: он умирает. Если вы выбираете себя, то умирает не игрок, а вы, и миньон становится бесом.',
                firstNight: true,
                otherNight: true,
                category: 'killing'
            }
        ]
    },
    
    // Сценарий "Дурная луна"
    'bad-moon-rising': {
        // Добрые персонажи (Горожане)
        good: [
            {
                id: 'grandmother',
                name: 'Бабушка',
                ability: 'Вы начинаете игру, зная одного доброго игрока. Если демон убивает его, вы умираете вместо него.',
                firstNight: true,
                otherNight: false
            },
            {
                id: 'sailor',
                name: 'Моряк',
                ability: 'Вы пьяны. Вы и ваш сосед не можете умереть ночью.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'chambermaid',
                name: 'Горничная',
                ability: 'Каждую ночь вы узнаете, сколько из двух игроков (не вы) просыпалось этой ночью.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'exorcist',
                name: 'Экзорцист',
                ability: 'Каждую ночь выбирайте игрока (не демона): его способность не работает этой ночью.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'innkeeper',
                name: 'Трактирщик',
                ability: 'Каждую ночь выбирайте двух игроков: они пьяны до следующей ночи, но защищены от демона.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'gambler',
                name: 'Азартный игрок',
                ability: 'Каждую ночь выбирайте игрока и персонажа: если верно, то этот игрок умирает.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'gossip',
                name: 'Сплетник',
                ability: 'Каждую ночь, если вы номинировали сегодня, кто-то умирает. Если нет, то никто не умирает.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'courtier',
                name: 'Придворный',
                ability: 'Один раз в игру выбирайте игрока: он пьян на 3 дня и 3 ночи.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'professor',
                name: 'Профессор',
                ability: 'Один раз в игру ночью выбирайте мёртвого игрока: если он добрый, он оживает.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'minstrel',
                name: 'Менестрель',
                ability: 'Если миньон казнён, все другие игроки (кроме вас) пьяны до конца следующего дня.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'tea-lady',
                name: 'Чайная дама',
                ability: 'Если оба ваших соседа добрые, они не могут умереть.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'pacifist',
                name: 'Пацифист',
                ability: 'Если казнён добрый игрок, следующей ночью никто не умирает.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'fool',
                name: 'Шут',
                ability: 'Первый раз, когда вас убивают, вы не умираете.',
                firstNight: false,
                otherNight: false,
                passive: true
            }
        ],
        
        // Злые персонажи (Чужаки)
        outsiders: [
            {
                id: 'tinker',
                name: 'Жестянщик',
                ability: 'Вы можете умереть в любую ночь.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'moonchild',
                name: 'Лунное дитя',
                ability: 'Если вы умираете, выбирайте игрока: если он добрый, он умирает этой ночью.',
                firstNight: false,
                otherNight: false,
                deathAbility: true
            },
            {
                id: 'goon',
                name: 'Головорез',
                ability: 'Каждую ночь первый игрок, который выбирает вас, становится пьяным до следующей ночи.',
                firstNight: false,
                otherNight: false,
                passive: true
            },
            {
                id: 'lunatic',
                name: 'Лунатик',
                ability: 'Вы думаете, что вы демон, но это не так. Каждую ночь вы просыпаетесь и "убиваете".',
                firstNight: true,
                otherNight: true
            }
        ],
        
        // Злые персонажи (Миньоны)
        minions: [
            {
                id: 'godfather',
                name: 'Крёстный отец',
                ability: 'Каждую ночь выбирайте игрока (не демона): если он будет номинирован завтра, он умирает.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'devil\'s-advocate',
                name: 'Адвокат дьявола',
                ability: 'Каждую ночь выбирайте живого игрока: если он будет казнён завтра, он не умирает.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'assassin',
                name: 'Ассасин',
                ability: 'Один раз в игру ночью выбирайте игрока: он умирает.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'mastermind',
                name: 'Гений',
                ability: 'Если бы добро победило, игра продолжается ещё один день и одну ночь.',
                firstNight: false,
                otherNight: false,
                passive: true
            }
        ],
        
        // Злые персонажи (Демоны)
        demons: [
            {
                id: 'zombuul',
                name: 'Зомбуул',
                ability: 'Каждую ночь* выбирайте игрока: он умирает. Если вы умираете, вы всё ещё в игре, но считаетесь мёртвым.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'pukka',
                name: 'Пукка',
                ability: 'Каждую ночь выбирайте игрока: он умирает через ночь. Выберите другого игрока: он умирает этой ночью.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'shabaloth',
                name: 'Шабалот',
                ability: 'Каждую ночь выбирайте до двух игроков: они умирают. Если вы не убиваете, вы можете выбрать мёртвого игрока: он оживает.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'po',
                name: 'По',
                ability: 'Каждую ночь выбирайте игрока: он умирает. Затем вы можете выбрать ещё одного игрока: он умирает, и так далее. Остановитесь в любой момент.',
                firstNight: true,
                otherNight: true
            }
        ]
    },
    
    // Сценарий "Секты и фиалки"
    'sects-and-violets': {
        // Добрые персонажи (Горожане)
        good: [
            {
                id: 'clockmaker',
                name: 'Часовщик',
                ability: 'В первую ночь вы узнаёте, сколько мест между демоном и ближайшим миньоном.',
                firstNight: true,
                otherNight: false
            },
            {
                id: 'dreamer',
                name: 'Сновидец',
                ability: 'Каждую ночь выбирайте игрока (не себя): вы узнаёте один из двух персонажей, один из которых у этого игрока.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'snake-charmer',
                name: 'Заклинатель змей',
                ability: 'Каждую ночь выбирайте игрока: если это демон, вы меняетесь персонажами и принадлежностью.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'mathematician',
                name: 'Математик',
                ability: 'Каждую ночь вы узнаёте, сколько способностей работало неправильно сегодня.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'flowergirl',
                name: 'Цветочница',
                ability: 'Каждую ночь вы узнаёте, номинировал ли демон сегодня.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'town-crier',
                name: 'Глашатай',
                ability: 'Каждую ночь вы узнаёте, номинировал ли миньон сегодня.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'oracle',
                name: 'Оракул',
                ability: 'Каждую ночь вы узнаёте, сколько мёртвых игроков злые.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'savant',
                name: 'Эрудит',
                ability: 'Каждый день вы можете публично спросить рассказчика о любых двух игроках, и узнать, сколько из них злые.',
                firstNight: false,
                otherNight: false
            },
            {
                id: 'seamstress',
                name: 'Швея',
                ability: 'Один раз в игру ночью выбирайте двух игроков: вы узнаёте, одинаковая ли у них принадлежность.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'philosopher',
                name: 'Философ',
                ability: 'Один раз в игру ночью выбирайте персонажа: вы получаете его способность. Если это персонаж чужака, вы становитесь злым.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'artist',
                name: 'Художник',
                ability: 'Один раз в игру ночью выбирайте игрока: вы узнаёте его персонажа.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'juggler',
                name: 'Жонглёр',
                ability: 'В первый день вы можете публично выбрать до 5 игроков. Этой ночью вы узнаёте, сколько из них злые.',
                firstNight: false,
                otherNight: false
            },
            {
                id: 'sage',
                name: 'Мудрец',
                ability: 'Если демон вас убивает, вы узнаёте, какой это демон.',
                firstNight: false,
                otherNight: false,
                deathAbility: true
            }
        ],
        
        // Злые персонажи (Чужаки)
        outsiders: [
            {
                id: 'barber',
                name: 'Цирюльник',
                ability: 'Если вы умираете, ночью демон выбирает двух игроков, чтобы поменять их персонажами.',
                firstNight: false,
                otherNight: false,
                deathAbility: true
            },
            {
                id: 'klutz',
                name: 'Растяпа',
                ability: 'Если вы казнены, выбирайте игрока: если он добрый, добро проигрывает.',
                firstNight: false,
                otherNight: false
            },
            {
                id: 'evil-twin',
                name: 'Злой близнец',
                ability: 'Вы и добрый игрок знаете друг друга. Если он умирает, вы можете умереть вместо него.',
                firstNight: true,
                otherNight: false
            },
            {
                id: 'witch',
                name: 'Ведьма',
                ability: 'Если игрок номинирует вас, он умирает этой ночью. Все узнают, что это произошло.',
                firstNight: false,
                otherNight: false,
                passive: true
            }
        ],
        
        // Злые персонажи (Миньоны)
        minions: [
            {
                id: 'cerenovus',
                name: 'Цереновус',
                ability: 'Каждую ночь выбирайте игрока и персонажа: этот игрок должен публично заявить, что он этот персонаж, иначе может быть казнён.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'pit-hag',
                name: 'Ведьма ям',
                ability: 'Каждую ночь выбирайте игрока и персонажа: этот игрок становится этим персонажем. Если выбран демон, может быть создан новый демон.',
                firstNight: false,
                otherNight: true
            },
            {
                id: 'witch',
                name: 'Ведьма',
                ability: 'Каждую ночь выбирайте игрока: если он номинирует завтра, он умирает. Все узнают, что это произошло.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'fang-gu',
                name: 'Фанг Гу',
                ability: 'Каждую ночь выбирайте игрока: он умирает. Если вы убиты и есть чужак, он становится Фанг Гу, а вы умираете.',
                firstNight: true,
                otherNight: true
            }
        ],
        
        // Злые персонажи (Демоны)
        demons: [
            {
                id: 'vigormortis',
                name: 'Вигормортис',
                ability: 'Каждую ночь выбирайте игрока: он умирает. Если убит миньон, его способность всё ещё работает, и только вы можете её использовать.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'no-dashii',
                name: 'Но-Даши',
                ability: 'Каждую ночь выбирайте игрока: он умирает. Соседи игроков, которых вы убили, пьяны.',
                firstNight: true,
                otherNight: true
            },
            {
                id: 'vortox',
                name: 'Вортокс',
                ability: 'Каждую ночь выбирайте игрока: он умирает. Все способности добрых игроков дают неверную информацию.',
                firstNight: true,
                otherNight: true
            }
        ]
    }
};

// Экспорт данных о персонажах для браузера
// Удаляем проверку на модули Node.js, так как они недоступны в браузере 