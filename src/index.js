import { useState, useEffect, useCallback } from "react";

const isString = (variable) =>
  typeof variable == "string" || variable instanceof String;

const useLocalStorage = (
  keys,
  { updateFrequency = 1000, noSync = false } = {}
) => {
  const isUsingMultipleKeys = !isString(keys);
  const initialValue = isUsingMultipleKeys ? keys : undefined;
  const [value, setValue] = useState(initialValue);

  const readFromLocalStorage = useCallback(() => {
    if (isUsingMultipleKeys) {
      for (const [key, oldValue] of Object.entries(value)) {
        const newValue = localStorage.getItem(key);
        if (newValue !== oldValue) {
          setValue((prev) => {
            return { ...prev, [key]: newValue };
          });
        }
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
          console.log(updatedKey, updatedValue);
          if (updatedValue !== undefined) {
            localStorage.setItem(updatedKey, updatedValue);
          } else {
            localStorage.removeItem(updatedKey);
          }
          setValue({ ...value, [updatedKey]: updatedValue });
        }
      } else {
        if (newValue !== undefined) {
          localStorage.setItem(keys, newValue);
        } else {
          localStorage.removeItem(keys);
        }
        setValue(newValue);
      }
    },
    [isUsingMultipleKeys, keys, value]
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
      for (const [key, oldValue] of Object.entries(value)) {
        const newValue = localStorage.getItem(key);
        if (newValue !== oldValue) {
          setValue((prev) => {
            return { ...prev, [key]: newValue };
          });
        }
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
