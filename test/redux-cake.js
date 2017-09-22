const expect = require('expect');
const { createStore } = require('redux');
const { reduxCake, combineReducers, addSlice, removeSlice } = require('../');

const REDUX_CAKE_SLICE = '@@redux-cake';
const UPDATE = 'UPDATE';

let store;

describe('addSlice', () => {

  before(() => {
    store = createStore(combineReducers({
      sum: (state, action) => {
        if (typeof state === 'undefined') return 1;

        return action.type === UPDATE ? state + action.value : state;
      }
    }), reduxCake);
  });

  it('should not throw after using enhancer', () => {
    expect(() => {
      addSlice('product', (state, action) => {
        if (typeof state === 'undefined') return 1;

        return action.type === UPDATE ? state * action.value : state;
      });
    }).not.toThrow();
  });

  it('should initialize new slices', () => {
    expect(store.getState()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 1,
      product: 1
    });
  });

  it('should update slice state when actions are dispatched', () => {
    store.dispatch({ type: UPDATE, value: 2 });

    expect(store.getState()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 3,
      product: 2
    });
  });

  it('should warn when provided duplicate slices', () => {
    const _warn = console.warn;
    let message;

    // hijack the console.warn() message so we can check it
    console.warn = msg => message = msg;

    addSlice('product', state => state);

    console.warn = _warn;

    expect(message).toMatch(/This slice was ignored/);
  });

});

describe('removeSlice', () => {

  it('should not throw after using enhancer', () => {
    expect(() => removeSlice('product')).not.toThrow();
  });

  it('should remove specified slices', () => {
    expect(store.getState()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 3
    });
  });

  it('should not break subsequently dispatched actions', () => {
    store.dispatch({ type: UPDATE, value: 3 });

    expect(store.getState()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 6
    });
  });

  it('should not throw when provided slices that do not exist', () => {
    expect(() => removeSlice('xyzzy')).not.toThrow();
  });

});

