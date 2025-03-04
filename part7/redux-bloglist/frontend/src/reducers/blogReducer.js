import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
                .sort((a, b) => b.likes - a.likes)
        },
        addBlog(state, action) {
            const newBlog = action.payload
            return [...state, newBlog]
                .sort((a, b) => b.likes - a.likes)
        }
    }
})

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blog) => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(addBlog(newBlog))
    }
}

// this is required to make the action visible for `initializeBlogs`
export const { setBlogs, addBlog } = blogSlice.actions
export default blogSlice.reducer