import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, newSearch] = useState('')

  // add effect hook to initialize the persons array
  const hook = () => {
    console.log('effect');
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data)
      })
  }
  useEffect(hook, [])
  console.log('render', persons.length, 'entries');

  const addName = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    let duplicate = false
    persons.forEach((item, index) => {
      if (item.name === newName) {
        alert(`${newName} is already added to phonebook`)
        duplicate = true
      }
    })
    if (!duplicate) {
      setPersons(persons.concat(person))
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameSearch = (event) => {
    newSearch(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleNameSearch={handleNameSearch} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} nameProps={[newName, handleNameChange]} numberProps={[newNumber, handleNumberChange]} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App;
