import {useState, useEffect} from 'react'

const useLocalStorage = (key, {updateFrequency} = {}) => {
  const [value, setValue] = useState()

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
    const readFromLocalStorage = () => {
      const oldValue = value
      const newValue = localStorage.getItem(key)
      if (newValue !== oldValue) {
        setValue(newValue)
      }
    }

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
  }, [key, value, updateFrequency])

  return [value, writeToLocalStorage]
}

const useLocalStorageNoSync = key => {
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

export default useLocalStorage

export {useLocalStorageNoSync}
