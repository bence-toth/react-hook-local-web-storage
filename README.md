# react-hook-local-web-storage :anchor:

A React hook to access `localStorage`.

## Installation

Using `npm`:

```sh
npm install react-hook-local-web-storage
```

Using `yarn`:

```sh
yarn add react-hook-local-web-storage
```

## Basic usage

The `useLocalStorage` hook, similarly to the `useState` hook, returns an array of two elements:

- The first element contains the value stored in `localStorage`.

- The second element is a function which can be called with a value which will be converted to string and stored in `localStorage`. If this function is called without an argument, or with the argument `null` or `undefined`, the `localStorage` entry will be removed.

The key to the `localStorage` entry you want to access must be supplied to the hook as its first argument.

For example:

```jsx
import useLocalStorage from "react-hook-local-web-storage";

const ComponentWithLocalStorage = () => {
  const [value, setValue] = useLocalStorage("myKey");

  return (
    <div className="App">
      <p>Value in LocalStorage: {value}</p>
      <button
        onClick={() => {
          setValue("Value from hook");
        }}
      >
        Set myKey
      </button>
      <button
        onClick={() => {
          setValue(null);
        }}
      >
        Unset myKey
      </button>
    </div>
  );
};
```

## Using multiple `localStorage` entires

The `useLocalStorage` hook can work with multiple `localStorage` entries simultaneously.

In order to achieve this, the first argument specified when calling the hook must be an object instead of a string. The keys of the object will represent the `localStorage` entry keys used by the hook. The values specified in this object will be ignored, in order to avoid confusion, it is recommended to use `null` as values.

If the `useLocalStorage` hook is called like this, the array it returns will contain two elements:

- The first element is an object which contains all values in the `localStorage` by the keys specified in the object the hook was called with.

- The second element is a function which expects an object as a parameter, in which the keys must be a subset of the keys of the object the hook was called with. Every `localStorage` entry corresponding to a key in this object will be set to the value specified by that key (converted to string). If the value by any key is `null` or `undefined`, the corresponding `localStorage` entry will be unset.

For example:

```jsx
import useLocalStorage from "react-hook-local-web-storage";

const ComponentWithLocalStorage = () => {
  const [values, setValues] = useLocalStorage({
    myKey: null,
    myOtherKey: null,
  });

  const { myKey, myOtherKey } = values;

  return (
    <div className="App">
      <p>
        Values in LocalStorage: {myKey}, {myOtherKey}
      </p>
      <button
        onClick={() => {
          setValues({ myKey: "Setting myKey from hook" });
        }}
      >
        Set myKey, leave myOtherKey intact
      </button>
      <button
        onClick={() => {
          setValues({ myOtherKey: "Setting myOtherKey from hook" });
        }}
      >
        Set myOtherKey, leave myKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: "Setting myKey from hook",
            myOtherKey: "Setting myOtherKey from hook",
          });
        }}
      >
        Set both myKey and myOtherKey
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: null,
          });
        }}
      >
        Unset myKey, leave myOtherKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myOtherKey: null,
          });
        }}
      >
        Unset myOtherKey, leave myKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: "Setting myKey from hook",
            myOtherKey: null,
          });
        }}
      >
        Set myKey and unset myOtherKey
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: null,
            myOtherKey: null,
          });
        }}
      >
        Unset both myKey and myOtherKey
      </button>
    </div>
  );
};
```

## Enable syncing

By default `localStorage` will be accessed only once when the component using the hook is mounted.

The hook can be configured to automatically react to changes of the `localStorage` entry or entries by calling it with a second `options` parameter, in which by the key `syncFrequency` the frequency of reading the data from `localStorage` can be specified in milliseconds.

This feature works the same way whether the hook is used with a single `localStorage` entry or multiple entires.

For example:

```jsx
import useLocalStorage from "react-hook-local-web-storage";

const ComponentWithLocalStorage = () => {
  const [value, setValue] = useLocalStorage("myKey", { syncFrequency: 1000 });

  return (
    <div className="App">
      <p>Value in LocalStorage: {value}</p>
      <button
        onClick={() => {
          setValue("Value from hook");
        }}
      >
        Set value with hook
      </button>
      <button
        onClick={() => {
          setValue(null);
        }}
      >
        Unset value
      </button>
    </div>
  );
};
```

Be aware that when the hook is used like this, the component will access `localStorage` at regular intervals, which can result in a delay in registering changes and lead to performance issues if the update frequency is low.

## Limitations

`localStorage` is using the Storage interface of the Web Storage API which requires all keys and values to be strings.

## Migrating from 1.x.x

If you were using default import, remember to specify the `syncFrequency` in the second `options` parameter when calling the hook to keep syncing with `localStorage`.

If you were using the named import `useLocalStorageNoSync`, simply switch to default import.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## License

`react-hook-local-web-storage` is licensed under [LGPL](./LICENSE).
