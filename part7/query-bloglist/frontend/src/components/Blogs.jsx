import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  return (
    <div>
      <Table hover>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Blogs
