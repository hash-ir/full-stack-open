import { useNotificationMessage } from '../NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useNotificationMessage()

  if (!notification) {
    return null
  }

  const { message, messageType } = notification

  const alertType = messageType === 'success' ? 'success' : 'danger'

  return (
    <div>
      <Alert variant={alertType}>{message}</Alert>
    </div>
  )
}

export default Notification
