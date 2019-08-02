import {useState, useEffect} from 'react'

const useLocalStorage = (key, {updateFrequency}) => {
  const [value, setValue] = useState()

  const readFromLocalStorage = () => {
    const oldValue = value
    const newValue = localStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
  }

  const writeToLocalStorage = newValue => {
    if (newValue !== undefined) {
      localStorage.setItem(key, newValue)
    }
    else {
      localStorage.removeItem(key)
    }
    setValue(newValue)
  }

  useEffect(() => {
    let readLocalStorageIntervalId
    if (window.localStorage) {
      readFromLocalStorage()
      readLocalStorageIntervalId = setInterval(
        readFromLocalStorage,
        updateFrequency
      )
    }
    return () => {
      if (window.localStorage) {
        clearInterval(readLocalStorageIntervalId)
      }
    }
  }, [])

  return [value, writeToLocalStorage]
}

const useLocalStorageNoSync = key => {
  const [value, setValue] = useState()

  const updateValue = oldValue => {
    const newValue = localStorage.getItem(key)
    newValue !== oldValue ? setValue(newValue) : ''
    return newValue
  }

  const write = newValue => {
    if (newValue !== undefined) {
      localStorage.setItem(key, newValue)
    }
    else {
      localStorage.removeItem(key)
    }
    setValue(newValue)
  }

  // taken from https://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
  const localStorageEnabled = test => {
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
  }

  // Function factory for creating curried functions. Does it make any sense?
  const useStore = (...fns) => {
    if (localStorageEnabled()) {
      fns.reduce((f, g) => (...args) => f(g(...args)))
    }
  }

  useEffect(() => useStore())

  return [() => updateValue(value), useStore(updateValue, write)]
}

export default {useLocalStorage, useLocalStorageNoSync}
