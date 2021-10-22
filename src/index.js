import { useState, useEffect } from "react";

const useLocalStorage = (key, { updateFrequency = 1000 } = {}) => {
  const [value, setValue] = useState();

  const writeToLocalStorage = (newValue) => {
    if (newValue !== undefined) {
      localStorage.setItem(key, newValue);
    } else {
      localStorage.removeItem(key);
    }
    setValue(newValue);
  };

  useEffect(() => {
    const readFromLocalStorage = () => {
      const oldValue = value;
      const newValue = localStorage.getItem(key);
      if (newValue !== oldValue) {
        setValue(newValue);
      }
    };

    let readLocalStorageIntervalId;
    if (window.localStorage) {
      readFromLocalStorage();
      readLocalStorageIntervalId = setInterval(
        readFromLocalStorage,
        updateFrequency
      );
    }
    return () => {
      if (window.localStorage) {
        clearInterval(readLocalStorageIntervalId);
      }
    };
  }, [key, value, updateFrequency]);

  return [value, writeToLocalStorage];
};

const useManyInLocalStorage = (keys, { updateFrequency = 1000 } = {}) => {
  const [values, setValues] = useState(keys);

  const writeObjectToLocalStorage = (newValues) => {
    for (const [key, value] of Object.entries(newValues)) {
      if (value !== undefined) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }
    setValues(newValues);
  };

  useEffect(() => {
    const readFromLocalStorage = () => {
      for (const [key, oldValue] of Object.entries(values)) {
        const newValue = localStorage.getItem(key);
        if (newValue !== oldValue) {
          setValues((prev) => {
            return { ...prev, key: newValue };
          });
        }
      }
    };

    let readLocalStorageIntervalId;
    if (window.localStorage) {
      readFromLocalStorage();
      readLocalStorageIntervalId = setInterval(
        readFromLocalStorage,
        updateFrequency
      );
    }
    return () => {
      if (window.localStorage) {
        clearInterval(readLocalStorageIntervalId);
      }
    };
  }, [key, value, updateFrequency]);

  return [value, writeObjectToLocalStorage];
};

const useLocalStorageNoSync = (key) => {
  const [value, setValue] = useState();

  const readFromLocalStorage = () => {
    const oldValue = value;
    const newValue = localStorage.getItem(key);
    if (newValue !== oldValue) {
      setValue(newValue);
    }
    return newValue;
  };

  const writeToLocalStorage = (newValue) => {
    if (newValue !== undefined) {
      localStorage.setItem(key, newValue);
    } else {
      localStorage.removeItem(key);
    }
    setValue(newValue);
  };

  return [readFromLocalStorage, writeToLocalStorage];
};

const useManyNoSync = (keys) => {
  const [values, setValues] = useState(keys);

  const writeObjectToLocalStorage = (newValues) => {
    for (const [key, value] of Object.entries(newValues)) {
      if (value !== undefined) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }
    setValues(newValues);
  };

  const readFromLocalStorage = () => {
    for (const [key, oldValue] of Object.entries(values)) {
      const newValue = localStorage.getItem(key);
      if (newValue !== oldValue) {
        setValues((prev) => {
          return { ...prev, key: newValue };
        });
      }
    }
    return values;
  };

  return [readFromLocalStorage, writeObjectToLocalStorage];
};

export default useLocalStorage;

export { useLocalStorageNoSync, useManyInLocalStorage, useManyNoSync };
