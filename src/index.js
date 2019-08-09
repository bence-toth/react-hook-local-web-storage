import {useState, useEffect} from 'react'

export const useLocalStorageNoSync = key => {
  const [value, setValue] = useState()

  const readFromLocalStorage = () => {
    const oldValue = value
    const newValue = localStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
    return newValue
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

  return [readFromLocalStorage, writeToLocalStorage]
}

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

export default useLocalStorage
