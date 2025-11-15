/**
 * Simple Calculator Application
 * A safe, accessible calculator with keyboard support and calculation history
 */

// Safe expression evaluator to replace eval()
class SafeCalculator {
    /**
     * Safely evaluates a mathematical expression
     * @param {string} expression - The mathematical expression to evaluate
     * @returns {number|string} - The result or error message
     */
    static evaluate(expression) {
        if (!expression || expression.trim() === '') {
            return 'Error: Empty expression';
        }

        // Remove any whitespace
        expression = expression.replace(/\s/g, '');

        // Replace constants
        expression = expression.replace(/π/g, Math.PI.toString());
        expression = expression.replace(/pi/gi, Math.PI.toString());

        // Replace power operator (^) with Math.pow
        // Handle patterns like: number^number
        let hasPower = false;
        while (expression.includes('^')) {
            hasPower = true;
            // Match: number or expression in parentheses, followed by ^, followed by number
            expression = expression.replace(/(\([^)]+\)|\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, (match, base, exp) => {
                return `Math.pow(${base},${exp})`;
            });
            // Safety check to prevent infinite loop
            if (!expression.includes('^')) break;
            // Limit iterations
            if (expression.split('^').length > 10) {
                return 'Error: Too many power operations';
            }
        }

        // Validate expression - allow Math.pow after replacement
        // First check original pattern, then allow Math.pow if power was used
        const originalPattern = /^[0-9+\-*/().π]+$/;
        const withMathPow = /^[0-9+\-*/().πMathpow,\s]+$/;
        
        if (!hasPower && !originalPattern.test(expression.replace(/\s/g, ''))) {
            return 'Error: Invalid characters';
        }
        if (hasPower && !withMathPow.test(expression)) {
            return 'Error: Invalid power expression';
        }

        // Check for balanced parentheses
        let parenCount = 0;
        for (let char of expression) {
            if (char === '(') parenCount++;
            if (char === ')') parenCount--;
            if (parenCount < 0) return 'Error: Unmatched parentheses';
        }
        if (parenCount !== 0) return 'Error: Unmatched parentheses';

        // Check for division by zero
        if (/\/\s*0(?!\.)/.test(expression)) {
            return 'Error: Division by zero';
        }

        try {
            // Use Function constructor as a safer alternative to eval
            // Still validates input before execution
            const result = Function('"use strict"; return (' + expression + ')')();
            
            // Handle special cases
            if (!isFinite(result)) {
                return 'Error: Invalid result';
            }
            
            // Round to avoid floating point precision issues
            return Math.round(result * 100000000) / 100000000;
        } catch (error) {
            return 'Error: Invalid expression';
        }
    }

    /**
     * Calculate square root
     * @param {number} value - The value to calculate square root of
     * @returns {number|string} - The result or error message
     */
    static sqrt(value) {
        if (value < 0) return 'Error: Negative square root';
        return Math.sqrt(value);
    }

    /**
     * Calculate power
     * @param {number} base - The base number
     * @param {number} exponent - The exponent
     * @returns {number|string} - The result or error message
     */
    static power(base, exponent) {
        const result = Math.pow(base, exponent);
        if (!isFinite(result)) return 'Error: Invalid power';
        return result;
    }

    /**
     * Calculate percentage
     * @param {string} expression - The expression before %
     * @returns {number|string} - The result or error message
     */
    static percentage(expression) {
        try {
            const value = SafeCalculator.evaluate(expression);
            if (typeof value === 'string') return value;
            return value / 100;
        } catch (error) {
            return 'Error: Invalid percentage';
        }
    }
}

// Memory management
class MemoryManager {
    constructor() {
        this.memory = 0;
        this.loadMemory();
    }

    add(value) {
        this.memory += parseFloat(value) || 0;
        this.saveMemory();
    }

    subtract(value) {
        this.memory -= parseFloat(value) || 0;
        this.saveMemory();
    }

    recall() {
        return this.memory;
    }

    clear() {
        this.memory = 0;
        this.saveMemory();
    }

    saveMemory() {
        try {
            localStorage.setItem('calculatorMemory', this.memory.toString());
        } catch (e) {
            console.warn('Could not save memory to localStorage');
        }
    }

    loadMemory() {
        try {
            const saved = localStorage.getItem('calculatorMemory');
            if (saved) {
                this.memory = parseFloat(saved) || 0;
            }
        } catch (e) {
            console.warn('Could not load memory from localStorage');
        }
    }
}

// Sound manager
class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('calculatorSound') !== 'false';
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not supported');
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('calculatorSound', this.enabled.toString());
        return this.enabled;
    }

    play(frequency = 800, duration = 50) {
        if (!this.enabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (e) {
            // Silently fail if audio can't be played
        }
    }
}

// Calculator state management
class CalculatorState {
    constructor() {
        this.history = [];
        this.maxHistoryItems = 10;
    }

    addToHistory(expression, result) {
        this.history.unshift({ expression, result, timestamp: new Date() });
        if (this.history.length > this.maxHistoryItems) {
            this.history.pop();
        }
        this.saveHistory();
    }

    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Could not save history to localStorage');
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('calculatorHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load history from localStorage');
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }
}

// DOM elements
const display = document.getElementById('textarea');
const clearBtn = document.getElementById('clear');
const backBtn = document.getElementById('back');
const equalBtn = document.getElementById('equal');
const numberButtons = document.querySelectorAll('[data-type="number"]');
const operatorButtons = document.querySelectorAll('[data-type="operator"]');
const scientificButtons = document.querySelectorAll('[data-type="scientific"]');
const constantButtons = document.querySelectorAll('[data-type="constant"]');
const percentageButtons = document.querySelectorAll('[data-type="percentage"]');
const memoryButtons = document.querySelectorAll('[data-type="memory"]');
const historyContainer = document.getElementById('history-container');
const historyToggle = document.getElementById('history-toggle');
const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');
const clearHistoryBtn = document.getElementById('clear-history');
const copyBtn = document.getElementById('copy-btn');

// Initialize calculator state
const calculatorState = new CalculatorState();
calculatorState.loadHistory();
const memoryManager = new MemoryManager();
const soundManager = new SoundManager();

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('calculatorTheme') || 'light';
        this.applyTheme(this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('calculatorTheme', this.currentTheme);
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
        }
    }
}

const themeManager = new ThemeManager();

// Display management
function updateDisplay(value, isError = false) {
    display.value = value;
    if (isError) {
        display.classList.add('error');
        setTimeout(() => display.classList.remove('error'), 2000);
    } else {
        display.classList.remove('error');
    }
}

function appendToDisplay(value) {
    const currentValue = display.value;
    if (currentValue === 'Error' || currentValue.startsWith('Error:')) {
        display.value = value;
    } else {
        display.value += value;
    }
}

// Button click handlers
function handleNumberClick(value) {
    appendToDisplay(value);
    soundManager.play(600, 30);
    display.focus();
}

function handleOperatorClick(value) {
    const currentValue = display.value;
    
    // If display shows an error, clear it first
    if (currentValue === 'Error' || currentValue.startsWith('Error:')) {
        display.value = '';
    }
    
    // Don't allow operators at the start (except minus for negative numbers)
    if (currentValue === '' && value !== '-') {
        return;
    }
    
    // Replace operator if last character is an operator
    const lastChar = currentValue.slice(-1);
    if (/[+\-*/]/.test(lastChar) && value !== '-') {
        display.value = currentValue.slice(0, -1) + value;
    } else {
        appendToDisplay(value);
    }
    soundManager.play(700, 30);
    display.focus();
}

function handleClear() {
    display.value = '';
    soundManager.play(500, 40);
    display.focus();
}

function handleBackspace() {
    const currentValue = display.value;
    if (currentValue === 'Error' || currentValue.startsWith('Error:')) {
        display.value = '';
    } else {
        display.value = currentValue.slice(0, -1);
    }
    soundManager.play(550, 30);
    display.focus();
}

function handleEquals() {
    const expression = display.value.trim();
    
    if (!expression) {
        return;
    }

    // Don't re-evaluate if already showing an error
    if (expression === 'Error' || expression.startsWith('Error:')) {
        return;
    }

    const result = SafeCalculator.evaluate(expression);
    
    if (typeof result === 'string' && result.startsWith('Error')) {
        updateDisplay(result, true);
        soundManager.play(300, 100);
    } else {
        calculatorState.addToHistory(expression, result);
        updateDisplay(result.toString());
        updateHistoryDisplay();
        soundManager.play(900, 50);
    }
    display.focus();
}

function handlePercentage() {
    const currentValue = display.value.trim();
    if (!currentValue || currentValue === 'Error' || currentValue.startsWith('Error:')) {
        return;
    }

    const result = SafeCalculator.percentage(currentValue);
    if (typeof result === 'string' && result.startsWith('Error')) {
        updateDisplay(result, true);
        soundManager.play(300, 100);
    } else {
        updateDisplay(result.toString());
        soundManager.play(800, 40);
    }
    display.focus();
}

function handleScientific(functionType) {
    const currentValue = display.value.trim();
    if (!currentValue || currentValue === 'Error' || currentValue.startsWith('Error:')) {
        return;
    }

    let result;
    const value = parseFloat(currentValue);

    switch(functionType) {
        case 'sqrt':
            result = SafeCalculator.sqrt(value);
            break;
        case 'square':
            result = value * value;
            break;
        case 'power':
            // For power, we'll use the current value as base
            // User can then enter exponent and press equals
            appendToDisplay('^');
            soundManager.play(700, 30);
            return;
        default:
            return;
    }

    if (typeof result === 'string' && result.startsWith('Error')) {
        updateDisplay(result, true);
        soundManager.play(300, 100);
    } else {
        updateDisplay(result.toString());
        soundManager.play(800, 40);
    }
    display.focus();
}

function handleConstant(value) {
    if (value === 'π') {
        appendToDisplay(Math.PI.toString());
        soundManager.play(600, 30);
    }
    display.focus();
}

function handleMemory(action) {
    const currentValue = display.value.trim();
    let numValue = 0;
    
    if (currentValue && currentValue !== 'Error' && !currentValue.startsWith('Error:')) {
        numValue = parseFloat(currentValue) || 0;
    }

    switch(action) {
        case 'add':
            memoryManager.add(numValue);
            soundManager.play(700, 40);
            break;
        case 'subtract':
            memoryManager.subtract(numValue);
            soundManager.play(700, 40);
            break;
        case 'recall':
            const memory = memoryManager.recall();
            updateDisplay(memory.toString());
            soundManager.play(800, 40);
            break;
        case 'clear':
            memoryManager.clear();
            soundManager.play(500, 40);
            break;
    }
    display.focus();
}

function handleCopy() {
    const value = display.value;
    if (!value || value === 'Error' || value.startsWith('Error:')) {
        return;
    }

    navigator.clipboard.writeText(value).then(() => {
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 1000);
        soundManager.play(1000, 30);
    }).catch(() => {
        // Fallback for older browsers
        display.select();
        document.execCommand('copy');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 1000);
    });
}

// History display
function updateHistoryDisplay() {
    if (!historyContainer) return;
    
    if (calculatorState.history.length === 0) {
        historyContainer.innerHTML = '<p class="history-empty">No calculations yet</p>';
        return;
    }

    const historyHTML = calculatorState.history.map((item, index) => {
        return `
            <div class="history-item" role="button" tabindex="0" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `;
    }).join('');

    historyContainer.innerHTML = historyHTML;

    // Add click handlers to history items
    historyContainer.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            const historyItem = calculatorState.history[index];
            display.value = historyItem.result.toString();
            display.focus();
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
}

function toggleHistory() {
    if (!historyContainer) return;
    const isHidden = historyContainer.classList.contains('hidden');
    historyContainer.classList.toggle('hidden');
    if (historyToggle) {
        historyToggle.setAttribute('aria-expanded', !isHidden);
    }
}

// Keyboard support
function handleKeyboardInput(event) {
    const key = event.key;

    // Prevent default for calculator keys
    if (/[0-9+\-*/().=]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }

    // Numbers
    if (/[0-9]/.test(key)) {
        handleNumberClick(key);
        return;
    }

    // Operators
    if (key === '+') handleOperatorClick('+');
    else if (key === '-') handleOperatorClick('-');
    else if (key === '*') handleOperatorClick('*');
    else if (key === '/') {
        event.preventDefault();
        handleOperatorClick('/');
    }
    // Parentheses
    else if (key === '(') handleOperatorClick('(');
    else if (key === ')') handleOperatorClick(')');
    // Decimal point
    else if (key === '.') handleNumberClick('.');
    // Equals
    else if (key === '=' || key === 'Enter') handleEquals();
    // Clear
    else if (key === 'Escape' || (key === 'c' && event.ctrlKey)) handleClear();
    // Backspace
    else if (key === 'Backspace') handleBackspace();
    // History toggle (H key)
    else if (key === 'h' || key === 'H') {
        if (historyToggle && document.activeElement !== historyToggle) {
            event.preventDefault();
            toggleHistory();
        }
    }
    // Theme toggle (T key)
    else if (key === 't' || key === 'T') {
        if (themeToggle && document.activeElement !== themeToggle) {
            event.preventDefault();
            themeManager.toggle();
        }
    }
    // Sound toggle (S key)
    else if (key === 's' || key === 'S') {
        if (soundToggle && document.activeElement !== soundToggle) {
            event.preventDefault();
            const enabled = soundManager.toggle();
            soundToggle.textContent = enabled ? '🔊' : '🔇';
            soundToggle.setAttribute('aria-label', enabled ? 'Disable sound effects' : 'Enable sound effects');
        }
    }
    // Copy (Ctrl+C)
    else if (key === 'c' && event.ctrlKey) {
        event.preventDefault();
        handleCopy();
    }
    // Percentage
    else if (key === '%') {
        event.preventDefault();
        handlePercentage();
    }
}

// Event listeners
clearBtn.addEventListener('click', handleClear);
backBtn.addEventListener('click', handleBackspace);
equalBtn.addEventListener('click', handleEquals);

numberButtons.forEach(button => {
    button.addEventListener('click', () => handleNumberClick(button.value));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => handleOperatorClick(button.value));
});

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.value === '√') {
            handleScientific('sqrt');
        } else if (button.value === 'x²') {
            handleScientific('square');
        } else if (button.value === 'x^y') {
            handleScientific('power');
        }
    });
});

constantButtons.forEach(button => {
    button.addEventListener('click', () => handleConstant(button.value));
});

percentageButtons.forEach(button => {
    button.addEventListener('click', handlePercentage);
});

memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.id === 'memory-add') handleMemory('add');
        else if (button.id === 'memory-subtract') handleMemory('subtract');
        else if (button.id === 'memory-recall') handleMemory('recall');
        else if (button.id === 'memory-clear') handleMemory('clear');
    });
});

if (copyBtn) {
    copyBtn.addEventListener('click', handleCopy);
}

// Keyboard support
display.addEventListener('keydown', handleKeyboardInput);
document.addEventListener('keydown', (e) => {
    // Only handle if not typing in an input (except our display)
    if (e.target === display || (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
        handleKeyboardInput(e);
    }
});

// History toggle
if (historyToggle) {
    historyToggle.addEventListener('click', toggleHistory);
}

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => themeManager.toggle());
}

// Clear history
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        calculatorState.clearHistory();
        updateHistoryDisplay();
    });
}

// Sound toggle
if (soundToggle) {
    soundToggle.textContent = soundManager.enabled ? '🔊' : '🔇';
    soundToggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        soundToggle.textContent = enabled ? '🔊' : '🔇';
        soundToggle.setAttribute('aria-label', enabled ? 'Disable sound effects' : 'Enable sound effects');
    });
}

// Initialize history display
updateHistoryDisplay();

// Focus management for accessibility
display.focus();
