
export const addNotification = ({ message, level }) => {
  return (dispatch, getState, { notificationSystem }) => {
    notificationSystem.clearNotifications()
    notificationSystem.addNotification({
      message,
      level: level || `info`,
      position: `bc`,
      dismissible: false,
    })
  }
}
