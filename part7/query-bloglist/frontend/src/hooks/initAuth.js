import { useEffect } from 'react'
import { useLogin } from '../UserContext'
import blogService from '../services/blogs'

export const useInitAuth = () => {
  const login = useLogin()

  useEffect(() => {
    // login with user if already saved in browser's local storage
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      blogService.setToken(user.token)
      login(user)
    }
  }, []) // empty array since login-check should only happen once
}
