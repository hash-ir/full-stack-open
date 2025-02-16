const AnecdoteForm = ({ handleSubmit }) => {
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