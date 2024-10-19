import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import contactService from './services/contacts'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, newSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  
  // add effect hook to initialize the persons array
  const hook = () => {
    console.log('effect');
    contactService
      .getAll()
      .then(initialContacts => {
        console.log('promise fulfilled');
        setPersons(initialContacts)
      })
  }
  useEffect(hook, [])
  console.log('render', persons.length, 'entries');

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    // add new contact, update existing (number), or skip (if contact exisits)
    const duplicate = persons.find(p => p.name === newName)
    // name matches
    if (duplicate) {
      if (duplicate.number === newNumber) {
        // alert user and skip
        alert(`${newName} is already added to phonebook`)
      } else {
        // confirm number update
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          contactService
            .update(duplicate.id, personObject)
            .then(returnedContact => {
              setPersons(persons.map(person => person.name === duplicate.name ? returnedContact : person))
              setMessage(`Number changed for ${newName}`)
              setMessageType('success')
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              console.log(error);
              setMessage(`Information of ${newName} has already been removed from server`)
              setMessageType('error')
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
        }
      }
    } else {
      // create new contact
      contactService
        .create(personObject)
        .then(returnedContact => {
          console.log(returnedContact);
          setPersons(persons.concat(returnedContact))
          setMessage(`Added ${personObject.name}`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error);
        })
    }

    // finally, reset name and number fields
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (name) => {
    const personToRemove = persons.find(p => p.name === name)
    if (window.confirm(`Delete ${personToRemove.name} ?`)) {
      console.log(`${name} needs to be deleted`);
      contactService
        .remove(personToRemove.id)
        .then(response => {
          const updatedPersons = persons.filter(p => p.name !== name)
          setPersons(updatedPersons)
          setMessage(`Deleted ${personToRemove.name}`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error);
          setMessage(`Information of ${personToRemove.name} has already been removed from server`)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    } else {
      console.log('Nothing to do here');
    }
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
      <Notification message={message} type={messageType}/>
      <Filter search={search} handleNameSearch={handleNameSearch} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} nameProps={[newName, handleNameChange]} numberProps={[newNumber, handleNumberChange]} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App;
