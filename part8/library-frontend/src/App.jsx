import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useMutation, useQuery } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`

const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const {
    loading: authorsLoading,
    data: authorsData,
    error: authorsError,
  } = useQuery(ALL_AUTHORS)
  const {
    loading: booksLoading,
    data: booksData,
    error: booksError,
  } = useQuery(ALL_BOOKS)
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  })

  if (authorsLoading || booksLoading) {
    return <div>loading data...</div>
  }

  if (!authorsData || !booksData) {
    return <div>No data available</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authorsData.allAuthors} />

      <Books show={page === 'books'} books={booksData.allBooks} />

      <NewBook show={page === 'add'} addBook={createBook} />
    </div>
  )
}

export default App
