import { combineReducers as reduxCombineReducers } from 'redux';

const REDUX_CAKE_SLICE = '@@redux-cake';
const REDUX_INIT = '@@redux/INIT';

let store, previousReducers;

// keeps track of a slice to remove after replacing the reducer
// (we only have a small window to remove it from state before
// combineReducers complains about it)
let sliceToRemove = null;

/**
 * Action types that will be dispatched during the lifecycle of dynamically
 * added or removed slices. Possible options are `ActionTypes.SLICE_ADDED`
 * and `ActionTypes.SLICE_REMOVED`.
 */
export const ActionTypes = {
  SLICE_ADDED: '@@redux-cake/SLICE_ADDED',
  SLICE_REMOVED: '@@redux-cake/SLICE_REMOVED'
};

/**
 * The store enhancer used to enable dynamic slice management. We mostly just
 * need this to grab a few references that we'll need later on.
 */
export const reduxCake = createStore => (reducer, preloadedState, enhancer) => {
  if (!reducer.originalReducers) {
    throw new Error('Redux Cake only works if you use our `combineReducers` function!');
  }

  // grab our reference to the store
  store = createStore(reducer, preloadedState, enhancer);

  previousReducers = reducer.originalReducers;

  return store;
};

/**
 * Adds a new slice of state to the reducer.
 * @param {string} key The slice of state that the new reducer should manage.
 * @param {function} reducer The reducer for this slice of state.
 */
export const addSlice = (key, reducer) => {
  if (!store) {
    throw new Error('Cannot call addSlice() without first using the `reduxCake` enhancer.');
  }

  if (previousReducers[key]) {
    console.warn(`There is already a slice with key "${key}". This slice was ignored.`);
    return;
  }

  previousReducers = {
    ...previousReducers,
    [key]: reducer
  };

  store.replaceReducer(combineReducers(previousReducers));

  store.dispatch({ type: ActionTypes.SLICE_ADDED, payload: key });
};

/**
 * Removes a slice of state from the reducer.
 * @param {string} key The slice of state that should be removed.
 */
export const removeSlice = key => {
  if (!store) {
    throw new Error('Cannot call removeSlice() without first using the `reduxCake` enhancer.');
  }

  if (!previousReducers[key]) {
    return;
  }

  previousReducers = { ...previousReducers };
  delete previousReducers[key];

  sliceToRemove = key;

  store.replaceReducer(combineReducers(previousReducers));

  sliceToRemove = null;

  store.dispatch({ type: ActionTypes.SLICE_REMOVED, payload: key });
};

/**
 * A wrapper around Redux's `combineReducers` implementation, giving us a
 * chance to intercept key actions, as well as grab a reference to the
 * raw reducers object.
 * @param {object} reducers An object whose keys represent slices of state,
 *   and whose corresponding values represent reducing functions for their
 *   respective slices of state.
 * @returns {function} A reducer that will invoke the sub reducers for each
 *   slice of state, returning the complete, combined state object.
 */
export const combineReducers = reducers => {
  // no need to make reducers required in this version
  if (!reducers) reducers = {};

  // we insert a dummy slice to keep the default `combineReducers` implementation
  // from warning about empty reducer objects
  if (!reducers[REDUX_CAKE_SLICE]) {
    reducers[REDUX_CAKE_SLICE] = state => null;
  }

  const combined = reduxCombineReducers(reducers);

  const finalReducer = (state, action) => {
    if (action && action.type === REDUX_INIT && sliceToRemove) {
      state = { ...state };
      delete state[sliceToRemove];
    }

    return combined(state, action);
  };

  finalReducer.originalReducers = reducers;

  return finalReducer;
};
