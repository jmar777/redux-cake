const expect = require('expect');
const { createStore, applyMiddleware, compose } = require('redux');
const thunk = require('redux-thunk').default;
const { reduxCake, combineReducers, addSlice, removeSlice } = require('../');

const REDUX_CAKE_SLICE = '@@redux-cake';
const UPDATE = 'UPDATE';

describe('reduxCake', () => {

  let store;

  it('should not throw when composed with middleware present', () => {
    expect(() => {
      store = createStore(combineReducers({}), compose(
        reduxCake,
        applyMiddleware(thunk)
      ));
    }).not.toThrow();
  });

  it('should not throw when adding slices with middleware present', () => {
    expect(() => {
      addSlice('sum', (state, action) => {
        if (typeof state === 'undefined') return 0;

        return action.type === UPDATE ? state + action.value : state;
      });
    }).not.toThrow();
  });

  it('should reduce properly with middleware present', () => {
    store.dispatch({ type: UPDATE, value: 5 });

    expect(store.getState()).toEqual({
      [REDUX_CAKE_SLICE]: null,
      sum: 5
    });
  });


  it('should play nice with thunk (and related non-action dispatchers)', () => {
    store.dispatch(dispatch => {
      expect(typeof dispatch).toBe('function');

      dispatch({ type: UPDATE, value: 5 });

      expect(store.getState()).toEqual({
        [REDUX_CAKE_SLICE]: null,
        sum: 10
      });
    });
  });

});
