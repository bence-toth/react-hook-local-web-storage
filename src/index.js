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
    let readLocalStorageInterval
    if (window.localStorage) {
      readFromLocalStorage()
      readLocalStorageInterval = setInterval(
        readFromLocalStorage,
        updateFrequency
      ) 
    }
    return () => {
      if (window.localStorage) {
        clearInterval(readLocalStorageInterval)
      }
    }
  }, [])

  return [value, writeToLocalStorage]
}

export default useLocalStorage
