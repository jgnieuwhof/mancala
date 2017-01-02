import { namespaceActions } from 'helpers/actions'

export const game = namespaceActions(
  'game',
  [
    'NEW_GAME',
    'START_MATCHMAKING',
    'START_GAME',
    'FINISH_GAME',
    'MAKE_MOVE',
    'CHANGE_TURN',
    'CAPTURE_WELL',
  ]
)
