import { useField } from '../hooks/field'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  // const [newBlog, setNewBlog] = useState({
  //   title: '',
  //   author: '',
  //   url: ''
  // })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })

    // // Reset the form
    // setNewBlog({
    //   title: '',
    //   author: '',
    //   url: ''
    // })
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title
          <input {...title} name="Title" id="blog-title" data-testid="title" />
        </div>
        <div>
          author
          <input
            {...author}
            name="Author"
            id="blog-author"
            data-testid="author"
          />
        </div>
        <div>
          url
          <input
            {...url}
            name="URL"
            id="blog-url"
            data-testid="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
