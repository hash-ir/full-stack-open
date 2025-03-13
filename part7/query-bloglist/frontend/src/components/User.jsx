import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const User = () => {
  const id = useParams().id
  const queryClient = useQueryClient()
  const users = queryClient.getQueryData(['users'])

  if (!users) {
    return <div>loading data...</div>
  }

  const user = users.find((u) => u.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <b>added blogs</b>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
