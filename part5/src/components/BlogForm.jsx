import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: ''
    })
    
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url
        })
        
        // Reset the form
        setNewBlog({
            title: '',
            author: '',
            url: ''
        })
    }
    return (
        <div>
            <form onSubmit={addBlog}>
                <h2>create new</h2>
                <div>
                    title
                    <input 
                        type="text" 
                        value={newBlog.title}
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
                        value={newBlog.author}
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
                        value={newBlog.url}
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