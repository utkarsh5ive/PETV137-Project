import { useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialState, reduce } from './calculator.js';

// Braun ET-series inspired: warm charcoal body, round keys,
// one signature amber "=" key. Quiet everywhere else.

const KEYS = [
  { label: 'AC', action: { type: 'clear' }, kind: 'fn' },
  { label: '±', action: { type: 'negate' }, kind: 'fn' },
  { label: '%', action: { type: 'percent' }, kind: 'fn' },
  { label: '÷', action: { type: 'operator', operator: '÷' }, kind: 'op' },
  { label: '7', action: { type: 'digit', digit: 7 } },
  { label: '8', action: { type: 'digit', digit: 8 } },
  { label: '9', action: { type: 'digit', digit: 9 } },
  { label: '×', action: { type: 'operator', operator: '×' }, kind: 'op' },
  { label: '4', action: { type: 'digit', digit: 4 } },
  { label: '5', action: { type: 'digit', digit: 5 } },
  { label: '6', action: { type: 'digit', digit: 6 } },
  { label: '-', action: { type: 'operator', operator: '-' }, kind: 'op' },
  { label: '1', action: { type: 'digit', digit: 1 } },
  { label: '2', action: { type: 'digit', digit: 2 } },
  { label: '3', action: { type: 'digit', digit: 3 } },
  { label: '+', action: { type: 'operator', operator: '+' }, kind: 'op' },
  { label: '0', action: { type: 'digit', digit: 0 }, wide: true },
  { label: '.', action: { type: 'decimal' } },
  { label: '=', action: { type: 'equals' }, kind: 'equals' },
];

const KEYMAP = {
  '0': { type: 'digit', digit: 0 }, '1': { type: 'digit', digit: 1 },
  '2': { type: 'digit', digit: 2 }, '3': { type: 'digit', digit: 3 },
  '4': { type: 'digit', digit: 4 }, '5': { type: 'digit', digit: 5 },
  '6': { type: 'digit', digit: 6 }, '7': { type: 'digit', digit: 7 },
  '8': { type: 'digit', digit: 8 }, '9': { type: 'digit', digit: 9 },
  '.': { type: 'decimal' },
  '+': { type: 'operator', operator: '+' },
  '-': { type: 'operator', operator: '-' },
  '*': { type: 'operator', operator: '×' },
  '/': { type: 'operator', operator: '÷' },
  '%': { type: 'percent' },
  'Enter': { type: 'equals' }, '=': { type: 'equals' },
  'Escape': { type: 'clear' }, 'Backspace': { type: 'clear' },
};

export default function App() {
  const [state, dispatch] = useReducer(reduce, initialState);

  useEffect(() => {
    const onKey = (e) => {
      const action = KEYMAP[e.key];
      if (action) {
        e.preventDefault();
        dispatch(action);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stage">
      <motion.div
        className="body"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <div className="brand">
          <span className="brand-name">ET-26</span>
          <span className="brand-sub">electronic calculator</span>
        </div>

        <div className="lcd" role="status" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state.display}
              className={state.error ? 'lcd-value lcd-error' : 'lcd-value'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
            >
              {state.display}
            </motion.span>
          </AnimatePresence>
          {state.operator && !state.error && (
            <span className="lcd-op">{state.operator}</span>
          )}
        </div>

        <div className="keys">
          {KEYS.map((k) => (
            <motion.button
              key={k.label}
              className={`key ${k.kind || 'num'} ${k.wide ? 'wide' : ''}`}
              onClick={() => dispatch(k.action)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92, y: 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              aria-label={k.label}
            >
              {k.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <p className="hint">keyboard works too — try typing 6×7 and Enter</p>
    </div>
  );
}
