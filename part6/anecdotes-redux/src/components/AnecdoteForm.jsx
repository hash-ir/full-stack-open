import { useDispatch } from "react-redux"
import { addAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const handleSubmit = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch(addAnecdote(content))
        // Clear the input after submission
        event.target.anecdote.value = ''
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