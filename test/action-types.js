const expect = require('expect');
const { ActionTypes } = require('../');

describe('ActionTypes', () => {
  it('should have expected action types', () => {
    expect(ActionTypes).toEqual({
      SLICE_ADDED: '@@redux-cake/SLICE_ADDED',
      SLICE_REMOVED: '@@redux-cake/SLICE_REMOVED'
    });
  });
});
