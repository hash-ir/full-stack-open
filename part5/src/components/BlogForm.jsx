const BlogForm = ({ newBlog, setNewBlog, handleCreateBlog }) => {
    const { title, author, url } = newBlog
    return (
        <div>
            <form onSubmit={handleCreateBlog}>
                <h2>create new</h2>
                <div>
                    title
                    <input 
                        type="text" 
                        value={title}
                        name="Title"
                        onChange={({ target }) => 
                            setNewBlog({
                                ...newBlog, 
                                title: target.value
                            })
                        }
                    />
                </div>
                <div>
                    author
                    <input 
                        type="text" 
                        value={author}
                        name="Author"
                        onChange={({ target }) => 
                            setNewBlog({
                                ...newBlog,
                                author: target.value
                            })
                        }
                    />
                </div>
                <div>
                    url
                    <input 
                        type="text" 
                        value={url}
                        name="URL"
                        onChange={({ target }) => 
                            setNewBlog({
                                ...newBlog,
                                url: target.value
                            })
                        }
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm