import { useState, useEffect, useCallback } from "react";

const isString = (variable) =>
  typeof variable == "string" || variable instanceof String;

const clearObjectValues = (object) =>
  Object.fromEntries(Object.entries(object).map(([key]) => [key, null]));

const safeObjectValues = (object) =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      [undefined, null].includes(value) ? null : `${value}`,
    ])
  );

const updateObjectFromLocalStorage = (object) => {
  let newValues = {};
  let hasSomethingChanged = false;
  for (const [key] of Object.entries(object)) {
    const oldValue = object[key];
    const newValue = localStorage.getItem(key);
    if (newValue !== oldValue) {
      newValues = { ...newValues, [key]: localStorage.getItem(key) };
      hasSomethingChanged = true;
    }
  }

  if (!hasSomethingChanged) {
    return false;
  }

  return newValues;
};

const useLocalStorage = (
  keys,
  { updateFrequency = 1000, noSync = false } = {}
) => {
  const isUsingMultipleKeys = !isString(keys);
  const initialValue = isUsingMultipleKeys ? clearObjectValues(keys) : null;
  const [value, setValue] = useState(initialValue);

  const readFromLocalStorage = useCallback(() => {
    if (isUsingMultipleKeys) {
      const newValues = updateObjectFromLocalStorage(value);
      if (newValues) {
        setValue({ ...value, ...newValues });
        return { ...value, ...newValues };
      }
      return value;
    } else {
      const oldValue = value;
      const newValue = localStorage.getItem(keys);
      if (newValue !== oldValue) {
        setValue(newValue);
      }
      return newValue;
    }
  }, [isUsingMultipleKeys, keys, value]);

  const writeToLocalStorage = useCallback(
    (newValue) => {
      if (isUsingMultipleKeys) {
        for (const [updatedKey, updatedValue] of Object.entries(newValue)) {
          let safeUpdatedValue;
          if ([undefined, null].includes(updatedValue)) {
            safeUpdatedValue = null;
            localStorage.removeItem(updatedKey);
          } else {
            safeUpdatedValue = `${updatedValue}`;
            localStorage.setItem(updatedKey, safeUpdatedValue);
          }
        }
        setValue((previousValue) => {
          return { ...previousValue, ...safeObjectValues(newValue) };
        });
      } else {
        let safeUpdatedValue;
        if ([undefined, null].includes(newValue)) {
          safeUpdatedValue = null;
          localStorage.removeItem(keys);
        } else {
          safeUpdatedValue = `${newValue}`;
          localStorage.setItem(keys, safeUpdatedValue);
        }
        setValue(safeUpdatedValue);
      }
    },
    [isUsingMultipleKeys, keys]
  );

  useEffect(() => {
    const readSingleKeyFromLocalStorage = () => {
      const oldValue = value;
      const newValue = localStorage.getItem(keys);
      if (newValue !== oldValue) {
        setValue(newValue);
      }
    };

    const readMultipleKeysFromLocalStorage = () => {
      const newValues = updateObjectFromLocalStorage(value);
      if (newValues) {
        setValue({ ...value, ...newValues });
      }
    };

    const readFromLocalStorage = isUsingMultipleKeys
      ? readMultipleKeysFromLocalStorage
      : readSingleKeyFromLocalStorage;

    let readLocalStorageIntervalId;
    if (window.localStorage) {
      readFromLocalStorage();
      if (!noSync) {
        readLocalStorageIntervalId = setInterval(
          readFromLocalStorage,
          updateFrequency
        );
      }
    }
    return () => {
      if (window.localStorage && !noSync) {
        clearInterval(readLocalStorageIntervalId);
      }
    };
  }, [keys, value, updateFrequency, isUsingMultipleKeys, noSync]);

  if (noSync) {
    return [readFromLocalStorage, writeToLocalStorage];
  }

  return [value, writeToLocalStorage];
};

export default useLocalStorage;
