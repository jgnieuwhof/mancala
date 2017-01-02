
// This is actually a thunk, due to the need for notificationSystem to be in scope
// I thought about putting it in a reducer, but we don't reduce notifications so wtf
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
