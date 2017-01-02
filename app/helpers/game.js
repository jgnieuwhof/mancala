
import { PLAYER, GAME } from 'constants'

import { randomInRange } from 'helpers/maths'

export const otherTurn = ({ turn }) => {
  return turn === PLAYER._1 ? PLAYER._2 : PLAYER._1
}

export const isPlayerWell = ({ wellId, player }) => {
  return wellId >= GAME.WELLS[player][0] && wellId <= GAME.WELLS[player][1]
}

export const generateGemPositions = ({ setup }) => {
  let gems = {}
  for(let id = 0; id < GAME.NUM_GEMS; id++) {
    let offset = (id < GAME.NUM_GEMS / 2) ? 0 : GAME.NUM_WELLS / 2
    let well = setup === 'random' ? randomInRange({ min: 0, max: (GAME.NUM_WELLS / 2) - 2 }) : id % 6
    gems[id] = offset + well
  }
  return gems
}
