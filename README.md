# Simple Calculator

A modern, accessible, and feature-rich calculator web application with keyboard support, calculation history, and dark mode.

## 🌟 Features

- **Safe Expression Evaluation**: Uses a secure expression parser instead of `eval()` for safe mathematical calculations
- **Full Keyboard Support**: Use your keyboard to input numbers, operators, and perform calculations
- **Calculation History**: View and reuse previous calculations with persistent storage
- **Dark Mode**: Toggle between light and dark themes with preference persistence
- **Memory Functions**: M+, M-, MR, MC for storing and recalling values
- **Scientific Functions**: Square root (√), square (x²), power (x^y), and constants (π)
- **Percentage Calculations**: Calculate percentages with the % button
- **Copy/Paste**: Copy results to clipboard with one click or Ctrl+C
- **Sound Effects**: Optional audio feedback for button presses (toggleable)
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Error Handling**: User-friendly error messages with visual feedback
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build process or dependencies required!

### Usage

#### Mouse/Touch
- Click buttons to input numbers and operators
- Click `=` to calculate
- Click `C` to clear
- Click `⌫` to backspace
- Click the history icon (📜) to view calculation history
- Click the theme icon (🌙/☀️) to toggle dark mode

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Input numbers |
| `+`, `-`, `*`, `/` | Mathematical operators |
| `(` `)` | Parentheses |
| `.` | Decimal point |
| `%` | Percentage |
| `Enter` or `=` | Calculate result |
| `Escape` | Clear display |
| `Backspace` | Delete last character |
| `Ctrl+C` | Copy result to clipboard |
| `H` | Toggle history panel |
| `T` | Toggle theme (light/dark) |
| `S` | Toggle sound effects |

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technical Details

### Security
- Replaced `eval()` with a safe expression evaluator
- Input validation and sanitization
- Division by zero detection
- Balanced parentheses checking

### Technologies
- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Custom properties, animations, responsive design
- **Vanilla JavaScript**: ES6+ classes, modern syntax, no dependencies

### Features Implementation

#### Safe Calculator
The `SafeCalculator` class validates and evaluates mathematical expressions safely without using `eval()`. Supports:
- Basic arithmetic operations
- Parentheses
- Power operations (^)
- Constants (π)
- Square root and square functions
- Percentage calculations

#### Memory Management
- M+ (Memory Add): Add current value to memory
- M- (Memory Subtract): Subtract current value from memory
- MR (Memory Recall): Display memory value
- MC (Memory Clear): Clear memory
- Memory persists across sessions via `localStorage`

#### State Management
- Calculation history stored in `localStorage`
- Theme preference persistence
- Sound preference persistence
- Memory value persistence
- Maximum 10 history items (configurable)

#### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatible

## 📝 Project Structure

```
simple-calculator/
├── index.html      # Main HTML structure
├── style.css       # All styles including dark mode
├── app.js          # Calculator logic and functionality
├── README.md       # This file
├── todo.md         # Project TODO list
└── LICENSE         # License file
```

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `style.css` to customize the color scheme.

### Adjusting History Limit
Modify `maxHistoryItems` in the `CalculatorState` class in `app.js`.

### Adding Features
The code is organized into classes for easy extension:
- `SafeCalculator`: Expression evaluation
- `CalculatorState`: History and state management
- `ThemeManager`: Theme switching

## 🐛 Known Issues

None currently! If you find any issues, please report them.

## 🔮 Future Enhancements

See `todo.md` for a comprehensive list of planned features including:
- Scientific calculator functions
- Memory functions (M+, M-, MR, MC)
- Unit converter
- PWA support
- And more!

## 📄 License

See LICENSE file for details.

## 👤 Author

Simple Calculator - A modern web calculator application

## 🌐 Demo

Live demo available at: http://calculator.vercel.app

---

**Note**: This calculator uses a safe expression evaluator. While it validates input, always be cautious with user input in production environments.
