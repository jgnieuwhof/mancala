
import PLAYER from './player'

const NUM_WELLS = 14

export default {
  NUM_WELLS,
  NUM_GEMS: 48,
  TRAY : {
    [PLAYER._1] : (NUM_WELLS / 2) - 1,
    [PLAYER._2] : NUM_WELLS - 1,
  },
  WELLS : {
    [PLAYER._1] : [ 0 , (NUM_WELLS / 2) - 2 ],
    [PLAYER._2] : [ NUM_WELLS / 2, NUM_WELLS - 2 ],
  }
}
