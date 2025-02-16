const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.payload.id
      const anecdoteToVote = state.find(n => n.id === id)
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdoteObject => 
        anecdoteObject.id !== id ? anecdoteObject : changedAnecdote
      ).sort((a, b) => b.votes - a.votes)
    }
    case 'NEW NOTE':
      return [...state, asObject(action.payload)]
        .sort((a, b) => b.votes - a.votes)
  }

  return state
}

// action creator for voting anecdotes
export const vote = (id) => {
  return {
    type: 'VOTE',
    payload: {id} 
  }
}

// action creator for adding anecdotes
export const addAnecdote = (event) => {
  event.preventDefault()
  const content = event.target.anecdote.value
  event.target.anecdote.value = ''
  return {
    type: 'NEW NOTE',
    payload: content
  }
}

export default anecdoteReducer