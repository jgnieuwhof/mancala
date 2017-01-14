import u from 'updeep'

import { user } from 'actions'

// ============================================================================
// User Action Creators
// ============================================================================

export const setUserId = id => {
  return dispatch => {
    dispatch({ type: user.SET_USER_ID, id })
  }
}

export const setUserName = (username) => {
  return (dispatch, getState, { socket }) => {
    localStorage.username = username
    socket.emit(`client::setUsername`, { username })
    dispatch({ type: user.SET_USERNAME, username })
  }
}

// ============================================================================
// User Reducer
// ============================================================================

export const defaultState = {
  username: null,
  id: null,
}

export default function reduceGame(state = defaultState, action) {
  let update

  switch (action.type) {
    // ------------------------------------------------------------------------
    case user.SET_USERNAME:
      update = { username: action.username }
      break

    // ------------------------------------------------------------------------
    case user.SET_USER_ID:
      update = { id: action.id }
      break
  }
  return update ? u(update, state) : state
}
