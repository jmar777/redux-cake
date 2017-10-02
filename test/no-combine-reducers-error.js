const expect = require('expect');
const { createStore } = require('redux');
const { reduxCake } = require('../');

describe('reduxCake', () => {
  it('should throw if our `combineReducers` was not used', () => {
    expect(() => createStore(state => state, reduxCake))
      .toThrow(/use our `combineReducers` function/);
  });
});
