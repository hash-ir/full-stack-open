import { useContext } from 'react'
import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'show':
    return { message: action.message, messageType: action.messageType }
  case 'hide':
    return null
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationMessage = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const useNotification = (message, messageType) => {
  const dispatch = useNotificationDispatch()
  return (message, messageType) => {
    dispatch({
      type: 'show',
      message: message,
      messageType: messageType,
    })

    setTimeout(() => {
      dispatch({ type: 'hide' })
    }, 5000)
  }
}

export default NotificationContext
