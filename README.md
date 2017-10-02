# redux-cake

Redux Cake is a [store enhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer) and small set of related APIs that facilitate the adding and removing of slices of state on the fly.

## Motivation & Goals

* Support flexible code organization and code splitting practices by enabling self-registering slices with the store.
* Allow applications to easily create and prune slices that don't need to be long-lived.
* Provide a drop-in replacement for Redux's standard [`combineReducers()`](http://redux.js.org/docs/api/combineReducers.html) implementation, so preexisting static reducers don't need to be refactored.
* Remain as lightweight as possible (currently ~1.7kb).

## Example Usage

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

* **[Getting Started](#getting-started)**
* **[API](#api)**
    * [reduxCake](#reduxcake)
    * [combineReducers(reducers)](#combinereducersreducers)
    * [addSlice(key, reducer)](#addslicekey-reducer)
    * [removeSlice(key)](#removeslicekey)
    * [ActionTypes](#actiontypes)
* **[Contributing](#contributing)**

## Getting Started

Redux Cake requires that you use both the `reduxCake` store enhancer, and the `combineReducers` exported from this module for your root reducer. Note that our `combineReducers` is simply a wrapper around Redux's, but for [technical reasons](https://github.com/reactjs/redux/issues/2613), is a necessity.

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

const store = createStore(combineReducers({}), compose(
  reduxCake,
  applyMiddleware(thunk)
));
```

Once your store is created, you're free to start calling [`addSlice()`](#addslicekey-reducer) and [`removeSlice()`](#removeslicekey) to manage your state slices as needed.


## API

### `reduxCake`

This is the [store enhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer) that enables the dynamic adding and removing of state slices. You don't need to do anything with this other than pass it `createStore()`, as shown in the [getting started](#getting-started) section.

### `combineReducers(reducers)`

Accepts an object whose keys represent slices of state, where the corresponding values are reducing functions for their respective slices. If this is a new concept to you, you should read the documentation for [Redux's default `combineReducers`](http://redux.js.org/docs/api/combineReducers.html) implementation. Ours is a wrapper around Redux's that retains API compatability.

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
});
```

### `addSlice(key, reducer)`

Accepts a string `key` and a function `reducer`, which together define a new slice of state and its reducer.

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

To get started:

1. Install dependencies
```sh
$ npm install
```

2. For local development, there is a watch server that will automatically generate new development (non-uglified) builds:
```sh
$ npm run dev
```

3. To create a release (uglified) build:
```sh
$ npm run build
```

4. To run the test suite:
```sh
# note: redux is a peer dependency. If you haven't installed it yet, then do that now:
$ npm install redux

$ npm test
```
