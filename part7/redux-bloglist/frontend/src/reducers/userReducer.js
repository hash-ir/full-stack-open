import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      dispatch(setNotification(`${user.name} logged in`, 'success'))
      // store in browser's local storage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (error) {
      dispatch(
        setNotification(error.response?.data?.error || error.message, 'error')
      )
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    // get logged in user from browser's local storage
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      // remove from local storage
      window.localStorage.removeItem('loggedUser')
      dispatch(setUser(null))
      dispatch(
        setNotification(`${user.name} successfully logged out`, 'success')
      )
    }
  }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer
