import { useState } from 'react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'

/* eslint-disable react/prop-types */
const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  // Query for all books (for genre list and all genres view)
  const {
    loading: allBooksLoading,
    data: allBooksData,
    refetch: refetchAllBooks,
  } = useQuery(ALL_BOOKS)

  const genre = selectedGenre === 'all genres' ? null : selectedGenre
  const {
    loading: filteredBooksLoading,
    data: filteredBooksData,
    refetch: refetchFilteredBooks,
  } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    skip: selectedGenre === 'all genres', // Skip this query for all genres
  })

  useEffect(() => {
    if (show) {
      refetchAllBooks()
      if (selectedGenre !== 'all genres') {
        refetchFilteredBooks()
      }
    }
  }, [show, selectedGenre, refetchAllBooks, refetchFilteredBooks])

  if (!show) {
    return null
  }

  if (
    allBooksLoading ||
    (filteredBooksLoading && selectedGenre !== 'all genres')
  ) {
    return <div>Loading books...</div>
  }

  const displayBooks =
    selectedGenre === 'all genres'
      ? allBooksData?.allBooks || []
      : filteredBooksData?.allBooks || []

  const getUniqueGenres = () => {
    const allGenres = new Set(['all genres'])

    if (allBooksData && allBooksData.allBooks) {
      allBooksData.allBooks.forEach((book) => {
        if (Array.isArray(book.genres)) {
          book.genres.forEach((genre) => {
            if (genre) allGenres.add(genre)
          })
        }
      })
    }

    return Array.from(allGenres)
  }

  const uniqueGenres = getUniqueGenres()

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
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => (
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
