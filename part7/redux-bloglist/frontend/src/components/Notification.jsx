import { useSelector } from "react-redux";

const Notification = () => {
  const { message, messageType } = useSelector(({ notification }) => notification)
  if (message === '') {
    return null;
  }

  const className = messageType === "success" ? "success" : "error";

  return <div className={className}>{message}</div>;
};

export default Notification;
