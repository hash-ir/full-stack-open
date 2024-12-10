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
        likes: favBlogObject.likes
    }

    return result
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}