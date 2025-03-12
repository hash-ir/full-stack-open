import { useContext } from 'react'
import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
  case 'login':
    return action.payload
  case 'logout':
    return null
  default:
    return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export const useLogin = (user) => {
  const dispatch = useUserDispatch()
  return (user) => {
    dispatch({ type: 'login', payload: user })
  }
}

export const useLogout = () => {
  const dispatch = useUserDispatch()
  return () => {
    dispatch({ type: 'logout' })
  }
}

export default UserContext