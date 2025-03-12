import { useNotification } from '../NotificationContext'
import { useLogout, useUserValue } from '../UserContext'

const LogoutButton = () => {
  const showNotification = useNotification()
  const logout = useLogout()
  const user = useUserValue()

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    logout()
    showNotification(`${user.name} successfully logged out`, 'success')
  }

  return <button onClick={handleLogout}>logout</button>
}

export default LogoutButton
