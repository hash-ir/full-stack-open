const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, curr) => {
    return prev.likes >= curr.likes ? prev : curr
  }

  if (blogs.length == 0) {
    return null
  }
  const favBlogObject = blogs.reduce(reducer, 0)
  const result = {
    title: favBlogObject.title,
    author: favBlogObject.author,
    likes: favBlogObject.likes,
  }

  return result
}

const mostBlogs = (blogs) => {
  const reducer = (acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }

  if (blogs.length == 0) {
    return null
  }

  const blogCounts = blogs.reduce(reducer, {})
  const authorWithMostBlogs = Object.entries(blogCounts).reduce(
    (prev, curr) => {
      return curr[1] > prev[1] ? curr : prev
    }
  )

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  }
}

const mostLikes = (blogs) => {
  const reducer = (acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }

  if (blogs.length == 0) {
    return null
  }

  const blogLikes = blogs.reduce(reducer, {})
  const authorWithMostLikes = Object.entries(blogLikes).reduce((prev, curr) => {
    return curr[1] > prev[1] ? curr : prev
  })

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
