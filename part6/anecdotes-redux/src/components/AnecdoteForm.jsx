import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const handleSubmit = async (event) => {
        event.preventDefault()

        const content = event.target.anecdote.value
        // Clear the input after submission
        event.target.anecdote.value = ''

        dispatch(createAnecdote(content))

        // Show Notification and clear after 5s
        dispatch(setNotification(`created '${content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
        
    }
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
                <div><input name='anecdote'/></div>
                <button type='submit'>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm