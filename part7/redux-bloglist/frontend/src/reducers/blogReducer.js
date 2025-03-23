import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    addBlog(state, action) {
      const newBlog = action.payload
      return [...state, newBlog].sort((a, b) => b.likes - a.likes)
    },
    like(state, action) {
      const blogId = action.payload.id
      const updatedBlog = action.payload

      return state
        .map((blog) => (blog.id !== blogId ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      const blogId = action.payload
      return state
        .filter((blog) => blog.id !== blogId)
        .sort((a, b) => b.likes - a.likes)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(addBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = await blogService.updateLikes(blog.id, blog)
    dispatch(like(likedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

// this is required to make the action visible for `initializeBlogs`
export const { setBlogs, addBlog, like, removeBlog } = blogSlice.actions
export default blogSlice.reducer
