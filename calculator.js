(() => {
  "use strict";

  const calculatorRoot = document.body || document.documentElement;
  const app = document.createElement("div");
  app.className = "calculator";
  app.innerHTML = `
    <style>
      :root {
        color-scheme: dark;
        --bg: #0f172a;
        --panel: #111827;
        --panel-2: #1f2937;
        --text: #f8fafc;
        --muted: #94a3b8;
        --accent: #38bdf8;
        --accent-2: #818cf8;
        --danger: #f87171;
        --shadow: 0 20px 50px rgba(0,0,0,0.35);
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at top, #1e293b, #020617 65%);
        font-family: Arial, Helvetica, sans-serif;
      }

      .calculator {
        width: min(92vw, 380px);
        padding: 18px;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(15,23,42,0.96), rgba(17,24,39,0.96));
        box-shadow: var(--shadow);
        border: 1px solid rgba(148,163,184,0.2);
      }

      .display {
        min-height: 96px;
        margin-bottom: 16px;
        padding: 14px 16px;
        border-radius: 18px;
        background: #020617;
        color: var(--text);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        gap: 6px;
        overflow: hidden;
        box-shadow: inset 0 0 0 1px rgba(148,163,184,0.12);
      }

      .expression {
        color: var(--muted);
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .main-display {
        font-size: 2rem;
        font-weight: 700;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .keys {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }

      button {
        border: 0;
        border-radius: 16px;
        height: 58px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        color: var(--text);
        background: var(--panel-2);
        transition: transform 0.08s ease, filter 0.2s ease, background 0.2s ease;
      }

      button:hover { filter: brightness(1.08); }
      button:active { transform: scale(0.98); }

      .operator { background: linear-gradient(180deg, #2563eb, #1d4ed8); }
      .action { background: linear-gradient(180deg, #ef4444, #dc2626); }
      .wide { grid-column: span 2; }
      .equal { background: linear-gradient(180deg, #0ea5e9, #0284c7); }
    </style>

    <div class="display" aria-live="polite">
      <div class="expression" id="expression">0</div>
      <div class="main-display" id="display">0</div>
    </div>

    <div class="keys">
      <button class="action" data-action="clear">C</button>
      <button class="action" data-action="delete">⌫</button>
      <button class="operator" data-value="/">÷</button>
      <button class="operator" data-value="*">×</button>

      <button data-value="7">7</button>
      <button data-value="8">8</button>
      <button data-value="9">9</button>
      <button class="operator" data-value="-">−</button>

      <button data-value="4">4</button>
      <button data-value="5">5</button>
      <button data-value="6">6</button>
      <button class="operator" data-value="+">+</button>

      <button data-value="1">1</button>
      <button data-value="2">2</button>
      <button data-value="3">3</button>
      <button class="equal wide" data-action="equals">=</button>

      <button class="wide" data-value="0">0</button>
      <button data-value=".">.</button>
    </div>
  `;

  calculatorRoot.appendChild(app);

  const displayEl = app.querySelector("#display");
  const expressionEl = app.querySelector("#expression");
  const buttons = app.querySelectorAll("button");

  let currentValue = "0";
  let storedValue = null;
  let pendingOperator = null;
  let shouldResetDisplay = false;

  function updateDisplay() {
    displayEl.textContent = currentValue;
    expressionEl.textContent = storedValue !== null && pendingOperator ? `${storedValue} ${pendingOperator}` : "";
  }

  function addDigit(value) {
    if (shouldResetDisplay) {
      currentValue = value;
      shouldResetDisplay = false;
    } else if (currentValue === "0" && value !== ".") {
      currentValue = value;
    } else {
      currentValue += value;
    }
    updateDisplay();
  }

  function addDecimal() {
    if (shouldResetDisplay) {
      currentValue = "0.";
      shouldResetDisplay = false;
      updateDisplay();
      return;
    }

    if (!currentValue.includes(".")) {
      currentValue += ".";
      updateDisplay();
    }
  }

  function performCalculation() {
    if (storedValue === null || pendingOperator === null) return;

    const left = Number(storedValue);
    const right = Number(currentValue);
    let result = 0;

    switch (pendingOperator) {
      case "+": result = left + right; break;
      case "-": result = left - right; break;
      case "*": result = left * right; break;
      case "/": 
        if (right === 0) {
          currentValue = "Error";
          storedValue = null;
          pendingOperator = null;
          shouldResetDisplay = true;
          updateDisplay();
          return;
        }
        result = left / right;
        break;
      default:
        return;
    }

    currentValue = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
    storedValue = null;
    pendingOperator = null;
    shouldResetDisplay = true;
    updateDisplay();
  }

  function handleOperator(operator) {
    if (pendingOperator && storedValue !== null) {
      performCalculation();
      storedValue = currentValue;
      pendingOperator = operator;
      shouldResetDisplay = true;
      updateDisplay();
      return;
    }

    storedValue = currentValue;
    pendingOperator = operator;
    shouldResetDisplay = true;
    updateDisplay();
  }

  function clearAll() {
    currentValue = "0";
    storedValue = null;
    pendingOperator = null;
    shouldResetDisplay = false;
    updateDisplay();
  }

  function deleteLast() {
    if (shouldResetDisplay) {
      currentValue = "0";
      shouldResetDisplay = false;
      updateDisplay();
      return;
    }

    if (currentValue.length > 1) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = "0";
    }
    updateDisplay();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const { value, action } = button.dataset;

      if (action === "clear") {
        clearAll();
        return;
      }

      if (action === "delete") {
        deleteLast();
        return;
      }

      if (action === "equals") {
        performCalculation();
        return;
      }

      if (/[0-9]/.test(value)) {
        addDigit(value);
        return;
      }

      if (value === ".") {
        addDecimal();
        return;
      }

      if (["+", "-", "*", "/"].includes(value)) {
        handleOperator(value);
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
      addDigit(key);
      return;
    }

    if (key === ".") {
      addDecimal();
      return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
      handleOperator(key);
      return;
    }

    if (key === "Enter" || key === "=") {
      performCalculation();
      return;
    }

    if (key === "Backspace") {
      deleteLast();
      return;
    }

    if (key === "Escape") {
      clearAll();
    }
  });

  updateDisplay();
})();
