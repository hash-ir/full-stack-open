import { useDispatch, useSelector } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import { clearNotification, setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter !== '') {
            return anecdotes.filter(anecdote => 
                anecdote.content
                    .toLowerCase()
                    .includes(filter.toLowerCase()))
        }
        return anecdotes
    })
    
    const handleVote = (anecdote) => {
        dispatch(vote(anecdote.id))
        
        // Show Notification and clear after 5s
        dispatch(setNotification(`you voted '${anecdote.content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default AnecdoteList