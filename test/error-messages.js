const expect = require('expect');
const { createStore } = require('redux');
const { reduxCake,  addSlice, removeSlice } = require('../');

describe('addSlice', () => {
  it('should throw if used before enhancer', () => {
    expect(() => addSlice('slice', state => state))
      .toThrow(/Cannot call addSlice\(\) without first/);
  });
});

describe('removeSlice', () => {
  it('should throw if used before enhancer', () => {
    expect(() => removeSlice('slice', state => state))
      .toThrow(/Cannot call removeSlice\(\) without first/);
  });
});

describe('reduxCake', () => {
  it('should throw if our `combineReducers` was not used', () => {
    expect(() => createStore(state => state, reduxCake))
        .toThrow(/use our `combineReducers` function/);
  });
});
