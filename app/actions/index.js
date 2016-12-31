import { namespaceActions } from 'helpers/actions'

export const game = namespaceActions(
  'game',
  [
    'NEW_GAME',
    'START_GAME',
    'FINISH_GAME',
    'START_MOVE',
    'MAKE_MOVE',
    'CHANGE_TURN',
    'CAPTURE_WELL',
  ]
)
