import { useState } from 'react'
import { BOOKS_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client'

/* eslint-disable react/prop-types */
const Books = ({ show, books }) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  const getUniqueGenres = () => {
    const allGenres = new Set(['all genres'])

    books?.forEach((book) => {
      if (Array.isArray(book.genres)) {
        book.genres.forEach((genre) => {
          if (genre) allGenres.add(genre)
        })
      }
    })

    return Array.from(allGenres)
  }

  const genre = selectedGenre === 'all genres' ? '' : selectedGenre
  const { loading: filteredBooksLoading, data: filteredBooksData } = useQuery(
    BOOKS_BY_GENRE,
    {
      variables: { genre },
    }
  )
  if (filteredBooksLoading) {
    return <div>loading books by genre {selectedGenre}</div>
  }

  if (!filteredBooksData || !filteredBooksData.allBooks) {
    return <div>No books found with genre {selectedGenre}</div>
  }

  const filteredBooks = filteredBooksData.allBooks

  if (!show) {
    return null
  }

  const uniqueGenres = getUniqueGenres(books)

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{selectedGenre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks && filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No books found in this genre</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        {uniqueGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={selectedGenre === genre ? 'active' : ''}
            style={{
              margin: '0.25rem',
              padding: '0.5rem',
              backgroundColor: selectedGenre === genre ? '#4a90e2' : '#f0f0f0',
              color: selectedGenre === genre ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
