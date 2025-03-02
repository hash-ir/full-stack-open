import PropTypes from "prop-types";

const Notification = ({ message, messageType }) => {
  if (message === "") {
    return null;
  }

  const className = messageType === "success" ? "success" : "error";

  return <div className={className}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Notification;
