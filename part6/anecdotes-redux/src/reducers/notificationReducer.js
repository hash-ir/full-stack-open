import { createSlice } from '@reduxjs/toolkit'

// no notification
const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        displayNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return null
        }
    }
})

export const setNotification = (message, timeoutSeconds) => {
    return dispatch => {
        dispatch(displayNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeoutSeconds * 1000)
    }
}

export const { displayNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer