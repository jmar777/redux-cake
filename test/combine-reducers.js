const expect = require('expect');
const { createStore } = require('redux');
const { combineReducers } = require('../');

const { combineReducers: reduxCombineReducers } = require('redux');

const REDUX_CAKE_SLICE = '@@redux-cake';

describe('combineReducers', () => {

  let reducer;

  before(() => {
    reducer = combineReducers({
      sum: (state, action) => {
        if (typeof state === 'undefined') return 0;

        return action.type === 'ADD' ? state + action.value : state;
      }
    });
  });

  it('should return a function', () => {
    expect(typeof reducer).toBe('function');
  });

  it('should perform slice-based initialization correctly', () => {
    expect(reducer()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 0
    });
  });

  it('should perform slice-based updates correctly', () => {
    expect(reducer({ sum: 4 }, { type: 'ADD', value: 3 })).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 7
    });
  });

  it('should not warn when given an empty reducers object', () => {
    const _error = console.error;

    // hijack console.error() so we can force a throw if it is used
    console.error = msg => { throw new Error(`Error logged: ${msg}`) };

    expect(() => createStore(combineReducers({}))).not.toThrow();

    console.error = _error;
  });

  it('should let the reducers parameter be optional', () => {
    expect(() => combineReducers()).not.toThrow();
  });

});
