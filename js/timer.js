/**
 * Модуль для управления таймером обсуждения
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTimerManager();
});

/**
 * Инициализирует менеджер таймера
 */
function initializeTimerManager() {
    const timerManager = new TimerManager({
        timerDisplayElement: document.getElementById('timer-time'),
        startButton: document.getElementById('timer-start'),
        stopButton: document.getElementById('timer-stop'),
        resetButton: document.getElementById('timer-reset'),
        defaultTime: 5 * 60 // 5 минут в секундах
    });
    
    // Сохраняем менеджер таймера в глобальной области видимости
    window.timerManager = timerManager;
}

/**
 * Класс для управления таймером обсуждения
 */
class TimerManager {
    /**
     * Конструктор
     * @param {Object} config Конфигурация таймера
     */
    constructor(config) {
        // Элементы DOM
        this.timerDisplayElement = config.timerDisplayElement;
        this.startButton = config.startButton;
        this.stopButton = config.stopButton;
        this.resetButton = config.resetButton;
        
        // Настройки таймера
        this.defaultTime = config.defaultTime || 300; // 5 минут по умолчанию
        this.remainingTime = this.defaultTime;
        this.isRunning = false;
        this.timerId = null;
        
        // Инициализация кнопок управления
        this.initializeControls();
        
        // Обновляем отображение таймера
        this.updateDisplay();
    }
    
    /**
     * Инициализирует кнопки управления таймером
     */
    initializeControls() {
        // Кнопка "Старт"
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.startTimer();
            });
        }
        
        // Кнопка "Стоп"
        if (this.stopButton) {
            this.stopButton.addEventListener('click', () => {
                this.stopTimer();
            });
        }
        
        // Кнопка "Сброс"
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                this.resetTimer();
            });
        }
    }
    
    /**
     * Запускает таймер
     */
    startTimer() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        this.timerId = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                this.timerAlarm();
                this.stopTimer();
                this.remainingTime = 0;
            }
            
            this.updateDisplay();
        }, 1000);
        
        // Обновляем состояние кнопок
        if (this.startButton) this.startButton.disabled = true;
        if (this.stopButton) this.stopButton.disabled = false;
    }
    
    /**
     * Останавливает таймер
     */
    stopTimer() {
        if (!this.isRunning) return;
        
        clearInterval(this.timerId);
        this.isRunning = false;
        
        // Обновляем состояние кнопок
        if (this.startButton) this.startButton.disabled = false;
        if (this.stopButton) this.stopButton.disabled = true;
    }
    
    /**
     * Сбрасывает таймер
     */
    resetTimer() {
        this.stopTimer();
        this.remainingTime = this.defaultTime;
        this.updateDisplay();
    }
    
    /**
     * Обновляет отображение таймера
     */
    updateDisplay() {
        if (!this.timerDisplayElement) return;
        
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        
        // Форматируем вывод в виде MM:SS
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.timerDisplayElement.textContent = formattedTime;
        
        // Если осталось мало времени, меняем цвет
        if (this.remainingTime <= 30) {
            this.timerDisplayElement.style.color = 'red';
        } else {
            this.timerDisplayElement.style.color = '';
        }
    }
    
    /**
     * Действие при истечении времени
     */
    timerAlarm() {
        // Сообщаем всем, что таймер истек
        alert('Время истекло!');
        
        // Генерируем событие
        const event = new CustomEvent('timer:expired');
        document.dispatchEvent(event);
    }
    
    /**
     * Устанавливает новое время
     * @param {number} minutes Количество минут
     */
    setTime(minutes) {
        if (minutes <= 0) return;
        
        this.stopTimer();
        this.remainingTime = minutes * 60;
        this.updateDisplay();
    }
} 