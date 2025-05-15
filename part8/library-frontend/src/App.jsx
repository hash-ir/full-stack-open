import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client'
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  BOOK_ADDED,
  CREATE_BOOK,
  EDIT_AUTHOR,
} from './queries'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const { loading: authorsLoading, data: authorsData } = useQuery(ALL_AUTHORS)
  const { loading: booksLoading, data: booksData } = useQuery(ALL_BOOKS)
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  })
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      if (data && data.data && data.data.bookAdded) {
        const addedBook = data.data.bookAdded
        alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
      } else {
        console.log('Data structure not as expected:', data)
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error)
    },
  })

  if (authorsLoading || booksLoading) {
    return <div>loading data...</div>
  }

  if (!authorsData || !booksData) {
    return <div>No data available</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors
          show={page === 'authors'}
          authors={authorsData.allAuthors}
          updateAuthor={editAuthor}
        />

        <Books show={page === 'books'} />
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setError={setErrorMessage}
          setPage={setPage}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={authorsData.allAuthors}
        updateAuthor={editAuthor}
      />

      <Books show={page === 'books'} books={booksData.allBooks} />

      <NewBook show={page === 'add'} addBook={createBook} setPage={setPage} />

      <Recommendations show={page === 'recommend'} books={booksData.allBooks} />
    </div>
  )
}

export default App
