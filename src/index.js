import {useState, useEffect} from 'react'

const useLocalStorage = (key, {updateFrequency}) => {
  const [value, setValue] = useState()

  const read = () => {
    const oldValue = value
    const newValue = localStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
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

  useEffect(() => {
    let readLocalStorageIntervalId
    if (window.localStorage) {
      read()
      readLocalStorageIntervalId = setInterval(
        read,
        updateFrequency
      )
    }
    return () => {
      if (window.localStorage) {
        clearInterval(readLocalStorageIntervalId)
      }
    }
  }, [])

  return [value, write]
}

const useLocalStorageNoSync = key => {
  const [value, setValue] = useState()

  const read = () => {
    const oldValue = value
    const newValue = localStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
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

  return [read, write]
}

export default {
  useLocalStorage,
  useLocalStorageNoSync
}
