
import { PLAYER, GAME } from 'constants'

export const otherTurn = ({ turn }) => {
  return turn === PLAYER._1 ? PLAYER._2 : PLAYER._1
}

export const isPlayerWell = ({ wellId, player }) => {
  return wellId >= GAME.WELLS[player][0] && wellId <= GAME.WELLS[player][1]
}
