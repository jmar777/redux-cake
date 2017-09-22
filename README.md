# redux-cake

A sweet utility for managing dynamic slices of state in your redux reducers.

Redux Cake is a [store enhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer), and small set of related APIs, that facilitate the adding and removing of slices of state on the fly.

The ability to add and remove dynamic slices of state is useful for code organization and code splitting purposes, as well as other scenarios where slices do not need to be long-lived. The goal of Redux Cake is to provide a small (~1.7kb) utility that is 100% backwards compatible with Redux's standard [`combineReducers()`](http://redux.js.org/docs/api/combineReducers.html) implementation, while adding dynamic state slice facilities.

## Usage

```javascript
import { createStore } from 'redux';
import { reduxCake, combineReducers, addSlice } from 'redux-cake';

const store = createStore(combineReducers({}), reduxCake);

addSlice('sum', (state, action) => {
  if (typeof state === 'undefined') return 0;

  return action.type === 'ADD' ? state + action.value : state;
});

store.dispatch({ type: 'ADD', value: 7 });

console.log(store.getState()); // { sum: 7 }
```

## Installation

```
$ npm install redux-cake
```

## Documentation

* **[Getting Started](#getting-started)
* **[API](#api)**
    * [reduxCake](#reduxcake)
    * [combineReducers(reducers)](#combinereducersreducers)
    * [addSlice(key, reducer)](#addslicekey-reducer)
    * [removeSlice(key)](#removeslicekey)
    * [ActionTypes](#actiontypes)
* **[Contributing](#contributing)**
* **[Running Tests](#running-tests)**

## Getting Started

Redux Cake requires that you use both the `reduxCake` store enhancer, and the `combineReducers` exported from this module for your root reducer.

For a basic setup, that will look like this:

```javascript
import { createStore } from 'redux';
import { reduxCake, combineReducers } from 'redux-cake';

const store = createStore(combineReducers({}), reduxCake);
```

If you have multiple enhancers to apply, you'll need to use `compose()`:

```javascript
import { createStore, compose, applyMiddleware } from 'redux';
import { reduxCake, combineReducers } from 'redux-cake';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

const store = createStore(combineReducers({}), compose(
  reduxCake,
  applyMiddleware(promiseMiddleware, thunk)
));
```

Once your store is created, you're free to start calling `addSlice()` and `removeSlice()` to manage your state slices as needed.


## API

### `reduxCake`

This is the [store enhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer) that enables the dynamic adding and removing of state slices. You don't need to do anything with this other than provide it `createStore()`, as shown in the [getting started](#getting-started) section.

### `combineReducers(reducers)`

Accepts an object whose keys represent slices of states, where the corresponding values are reducing functions for their respective slices.

This is just a wrapper around [redux's default `combineReducers`](http://redux.js.org/docs/api/combineReducers.html) implementation. While it behaves the same, _it is important that you actually use this one_, as we need to intercept actions as they pass through.

Note that you can can still use this to provide initial/static state slices upon store creation, just like you normally would.

**Example:**

```javascript
import { combineReducers } from 'redux-cake';

const rootReducer = combineReducers({
  favoriteColors: (state, action) => {
    if (state === 'undefined') return [];
    
    if (action.type === 'ADD_FAVORITE_COLOR') {
      return [...state, action.color];
    }
    
    return state;
  }
})
```

### `addSlice(key, reducer)`

Accepts a string `key` and a function `reducer` which define a new slice of state and its reducer.

The reducer function should accept `state` and `action` arguments, just like any other reducer function. Additionally, it needs to conform to the same criteria imposed by `combineReducers` [here](http://redux.js.org/docs/api/combineReducers.html#notes).

Most notably, be sure that:

1. Your reducer _never_ returns `undefined`.
2. When the state given to it is `undefined`, your reducer should return the initial state for that slice.

The new slice of state will be added to the store immediately, and the reducer function will begin receiving new actions.


**Example:**

```javascript
import { addSlice } from 'redux-cake';

// same slice and reducer as above, but added dynamically this time
addSlice('favoriteColors', (state, action) => {
  if (state === 'undefined') return [];

  if (action.type === 'ADD_FAVORITE_COLOR') {
    return [...state, action.color];
  }

  return state;
});
```

Attempts to add a slice that already exists will _not_ throw an error, but a warning message will be logged.

### `removeSlice(key)`

Accepts a string `key` that indicates a slice of state to be removed.

The specified slice will be removed immediately, and the associated reducer will not receive any more actions.

Attempts to remove a slice that doesn't exist will _not_ throw an error, and will simply be ignored.

**Example:**

```javascript
import { removeSlice } from 'redux-cake';

removeSlice('favoriteColors');
```

### `ActionTypes`

When a slice is added or removed using `addSlice()` or `removeSlice()`, Redux Cake will dispatch a relevant action. I'm not currently aware of any use cases for consuming code to respond to these actions, but if needed, you can reference `ActionTypes.SLICE_ADDED` and `ActionTypes.SLICE_REMOVED`.

## Contributing

Pull requests are welcome, but I recommend filing an issue to discuss feature proposals first.

For local development, just run `npm install`, and then `npm run dev` to start the watch server.

To create a production-ready build, use `npm run build`.`

## Running Tests

```
$ npm test
```

Please note that the tests require `redux` to run, which is a peer dependency, so you'll need to run `npm install redux` first.
