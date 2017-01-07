import u from 'updeep'

import { user } from 'actions'

// ============================================================================
// User Action Creators
// ============================================================================

export const setUsername = ({ username }) => {
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
}

export default function reduceGame(state = defaultState, action) {
  let update

  switch (action.type) {
    // ------------------------------------------------------------------------
    case user.SET_USERNAME:
      update = { username: action.username }
      break
  }
  return update ? u(update, state) : state
}
