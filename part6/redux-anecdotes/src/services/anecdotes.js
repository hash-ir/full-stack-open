import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const updateVotes = async (id) => {
    const anecdoteResponse = await axios.get(`${baseUrl}/${id}`)
    const anecdoteToVote = anecdoteResponse.data
    const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
    const response = await axios.put(`${baseUrl}/${id}`, votedAnecdote)
    return response.data
}

export default { getAll, createNew, updateVotes }