# react-hook-local-storage :anchor:

A React hook to access `localStorage`.

## Installation

Using `npm`:

```sh
npm install --save react-hook-local-storage
```

Using `yarn`:

```sh
yarn add react-hook-local-storage
```

## Basic usage

The `useLocalStorage()` hook, similarly to the `useState()` hook, returns an array of two elements: 

- the first element contains the value stored in `localStorage`, which is getting updated at regular intervals

- the second element is function which can be called with a value that will be stored in `localStorage`. If you call this function without an argument, the `localStorage` entry will be removed.

The key to the `localStorage` entry you want to access must be supplied to the hook as its first argument:

```jsx
import React from 'react'
import useLocalStorage from 'react-hook-local-storage'

const ComponentWithLocalStorage = () => {
  const [value, setValue] = useLocalStorage('myKey')

  return (
    <div className="App">
      <p>Value in LocalStorage: {value}</p>
      <button
        onClick={() => setValue('Value from hook')}
      >
        Set value with hook
      </button>
      <button
        onClick={() => setValue()}
      >
        Unset value
      </button>
    </div>
  )
}
```

## Tweaking update frequency

The default update frequency of the `localStorage` content is 1 second which can be overridden by calling `useLocalStorage()` with a second argument which is an options object, and has a member called `updateFrequency` that indicates the desired update frequency in milliseconds:

```jsx
const [value, setValue] = useLocalStorage(
  'myKey',
  {updateFrequency: 500}
)
```

Read more about this in [Caveats](#caveats).

## Caveats

This hook is accessing `localStorage` content at regular intervals, which can result in a delay in registering changes and lead to performance issues if the update frequency is low.

`localStorage` is using the Storage interface of the Web Storage API that requires all keys and values to be strings.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
