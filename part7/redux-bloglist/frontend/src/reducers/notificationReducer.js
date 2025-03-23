import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    messageType: null,
  },
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return {
        message: '',
        messageType: null,
      }
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (message, messageType, timeoutSeconds = 5) => {
  return (dispatch) => {
    dispatch(showNotification({ message, messageType }))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeoutSeconds * 1000)
  }
}

export default notificationSlice.reducer
