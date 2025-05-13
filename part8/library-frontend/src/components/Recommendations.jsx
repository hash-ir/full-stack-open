import { useQuery } from '@apollo/client'
import { LOGGEDUSER } from '../queries'
import { useEffect } from 'react'

/* eslint-disable react/prop-types */
const Recommendations = ({ show, books }) => {
  // Configure query to refetch when component is displayed and fetch policy that ensures latest data
  const {
    loading: userLoading,
    data: userData,
    refetch,
    error,
  } = useQuery(LOGGEDUSER, {
    fetchPolicy: 'network-only', // Don't use cache for this query
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch])

  if (!show) {
    return null
  }

  if (userLoading) {
    return <div>loading logged user data...</div>
  }

  if (error) {
    console.error('Error fetching user data:', error)
    return <div>Error loading user data. Please try refreshing the page.</div>
  }

  if (!userData || !userData.me) {
    return <div>No user data available. Please log in again.</div>
  }

  const favoriteGenre = userData.me.favoriteGenre
  const filteredBooks =
    books?.filter(
      (book) =>
        book.genres &&
        Array.isArray(book.genres) &&
        book.genres.includes(favoriteGenre)
    ) || []

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{favoriteGenre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No books found in your favorite genre</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
