import PropTypes from 'prop-types'
import { useNotificationMessage } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationMessage()

  if (!notification) {
    return null
  }

  const { message, messageType } = notification

  const className = messageType === 'success' ? 'success' : 'error'

  return <div className={className}>{message}</div>
}

export default Notification
