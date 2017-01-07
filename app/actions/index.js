import { namespaceActions } from 'helpers/actions'

export const game = namespaceActions(
  'game',
  [
    'NEW_GAME',
    'ENTER_TRIAGE',
    'START_MATCHMAKING',
    'START_GAME',
    'FINISH_GAME',
    'MAKE_MOVE',
    'UPDATE_SETTINGS',
    'CHANGE_TURN',
    'CAPTURE_WELL',
  ],
)

export const user = namespaceActions(
  'user',
  [
    'SET_USERNAME',
  ],
)
