import { useState } from 'react'

/* eslint-disable react/prop-types */
const Authors = ({ show, authors, updateAuthor }) => {
  const [name, setName] = useState('')
  const [birthyear, setBirthYear] = useState('')

  if (!show) {
    return null
  }

  const submit = async (event) => {
    try {
      event.preventDefault()
      updateAuthor({ variables: { name, birthyear: parseInt(birthyear) } })

      setName('')
      setBirthYear('')
    } catch (error) {
      console.error('Error updating author:', error)
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select
            name="selectedAuthor"
            id="author"
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="text"
            value={birthyear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
