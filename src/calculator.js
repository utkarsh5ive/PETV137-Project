// Pure calculator state machine — no UI, fully testable.

export const initialState = {
  display: '0',
  previous: null,
  operator: null,
  overwrite: true,
  error: false,
};

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? null : a / b;
    default: return b;
  }
}

function format(n) {
  if (n === null || !isFinite(n)) return null;
  const s = String(Math.round(n * 1e10) / 1e10);
  return s.length > 12 ? n.toExponential(6) : s;
}

export function reduce(state, action) {
  if (state.error && action.type !== 'clear') return state;

  switch (action.type) {
    case 'digit': {
      if (state.overwrite) {
        return { ...state, display: String(action.digit), overwrite: false };
      }
      if (state.display.replace(/[-.]/g, '').length >= 12) return state;
      const display =
        state.display === '0' ? String(action.digit) : state.display + action.digit;
      return { ...state, display };
    }
    case 'decimal': {
      if (state.overwrite) return { ...state, display: '0.', overwrite: false };
      if (state.display.includes('.')) return state;
      return { ...state, display: state.display + '.' };
    }
    case 'operator': {
      const current = parseFloat(state.display);
      if (state.operator !== null && !state.overwrite) {
        const result = format(compute(state.previous, current, state.operator));
        if (result === null) return { ...initialState, display: 'Error', error: true };
        return { ...state, display: result, previous: parseFloat(result), operator: action.operator, overwrite: true };
      }
      return { ...state, previous: current, operator: action.operator, overwrite: true };
    }
    case 'equals': {
      if (state.operator === null) return state;
      const result = format(compute(state.previous, parseFloat(state.display), state.operator));
      if (result === null) return { ...initialState, display: 'Error', error: true };
      return { ...initialState, display: result, overwrite: true };
    }
    case 'percent': {
      return { ...state, display: format(parseFloat(state.display) / 100), overwrite: true };
    }
    case 'negate': {
      if (state.display === '0') return state;
      const display = state.display.startsWith('-')
        ? state.display.slice(1)
        : '-' + state.display;
      return { ...state, display };
    }
    case 'clear':
      return { ...initialState };
    default:
      return state;
  }
}
