import { describe, it, expect } from 'vitest';
import { initialState, reduce } from './calculator.js';

const run = (actions) => actions.reduce(reduce, initialState);
const d = (digit) => ({ type: 'digit', digit });
const op = (operator) => ({ type: 'operator', operator });
const eq = { type: 'equals' };

describe('calculator', () => {
  it('enters digits', () => {
    expect(run([d(1), d(2), d(3)]).display).toBe('123');
  });

  it('adds', () => {
    expect(run([d(2), op('+'), d(3), eq]).display).toBe('5');
  });

  it('subtracts into negatives', () => {
    expect(run([d(2), op('-'), d(5), eq]).display).toBe('-3');
  });

  it('multiplies', () => {
    expect(run([d(4), op('×'), d(2), d(5), eq]).display).toBe('100');
  });

  it('divides', () => {
    expect(run([d(9), op('÷'), d(4), eq]).display).toBe('2.25');
  });

  it('chains operations left to right', () => {
    expect(run([d(2), op('+'), d(3), op('×'), d(4), eq]).display).toBe('20');
  });

  it('handles decimals and floating point', () => {
    expect(run([d(0), { type: 'decimal' }, d(1), op('+'), d(0), { type: 'decimal' }, d(2), eq]).display).toBe('0.3');
  });

  it('ignores duplicate decimal points', () => {
    expect(run([d(1), { type: 'decimal' }, { type: 'decimal' }, d(5)]).display).toBe('1.5');
  });

  it('shows Error on divide by zero', () => {
    const s = run([d(8), op('÷'), d(0), eq]);
    expect(s.display).toBe('Error');
    expect(s.error).toBe(true);
  });

  it('recovers from error only via clear', () => {
    const s = run([d(8), op('÷'), d(0), eq, d(5)]);
    expect(s.display).toBe('Error');
    expect(reduce(s, { type: 'clear' }).display).toBe('0');
  });

  it('percent converts display', () => {
    expect(run([d(5), d(0), { type: 'percent' }]).display).toBe('0.5');
  });

  it('negates', () => {
    expect(run([d(7), { type: 'negate' }]).display).toBe('-7');
    expect(run([d(7), { type: 'negate' }, { type: 'negate' }]).display).toBe('7');
  });

  it('clear resets everything', () => {
    expect(run([d(9), op('+'), d(1), { type: 'clear' }])).toEqual(initialState);
  });

  it('caps input at 12 digits', () => {
    const s = run(Array.from({ length: 15 }, () => d(9)));
    expect(s.display.length).toBe(12);
  });
});
