import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const changedAnecdote = action.payload
      return state.map(anecdoteObject =>
        anecdoteObject.id !== id
          ? anecdoteObject
          : changedAnecdote
      ).sort((a, b) => b.votes - a.votes)
    },
    addAnecdote(state, action) {
      const newAnecdote = action.payload
      return [...state, newAnecdote]
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes)
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.updateVotes(id)
    dispatch(vote(votedAnecdote))
  }
}

export const { vote, addAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer