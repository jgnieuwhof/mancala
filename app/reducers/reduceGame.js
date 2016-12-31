
import u from 'updeep'

import { game } from 'actions'
import { GAME_STATES, PLAYER, GAME, TRAY_TYPE } from 'constants'

import { otherTurn, isPlayerWell } from 'helpers/game'
import { randomInRange } from 'helpers/maths'
import { addNotification } from 'helpers/notification'

// ============================================================================
// Game Action Creators
// ============================================================================

export const newGame = () => ({ type: game.NEW_GAME })
export const startGame = ({ setup }) => ({ type: game.START_GAME, setup })

export const makeMove = ({ start }) => {
  return (dispatch, getState, { notificationSystem }) => {
    let { game: { turn, wells } } = getState()
    let nMoves = wells[start].gems.length
    for(let i = 0; i < nMoves; i++) {
      let currentWell = (start + i) % GAME.NUM_WELLS
      for(let j = 0; j < (nMoves - i); j++) {
        dispatch({ type: game.MAKE_MOVE, well: currentWell })
      }
    }
    let finalWell = (start + nMoves) % GAME.NUM_WELLS
    let isCurPlayerWell = isPlayerWell({ wellId: finalWell, player: turn })
    let correspondingWell = (GAME.NUM_WELLS - 2) - finalWell
    if (isCurPlayerWell && wells[finalWell].gems.length === 0 && wells[correspondingWell].gems.length > 0) {
      dispatch({ type: game.CAPTURE_WELL, well: finalWell })
      dispatch({ type: game.CAPTURE_WELL, well: correspondingWell })
      dispatch(addNotification({ message: `Captured!`, level: `success`  }))
    }
  }
}

export const nextTurn = ({ start, nMoves }) => {
  return (dispatch, getState) => {
    let { game: { turn, wells } } = getState()
    let wellsWithGems = wells.filter(w => (w.type === TRAY_TYPE.WELL && w.gems.length > 0))
    if (wellsWithGems.length === 0)
      dispatch({ type: game.FINISH_GAME })
    else {
      let hasFreeTurn = (start + nMoves % GAME.NUM_WELLS) === GAME.TRAY[turn]
      let newTurn = hasFreeTurn ? turn : otherTurn({ turn })
      let playerWellsWithGems = wells.filter(w => {
        return isPlayerWell({ wellId: w.id, player: newTurn }) && w.gems.length > 0
      })
      if (playerWellsWithGems.length > 0) {
        if (hasFreeTurn)
          dispatch(addNotification({ message: `Free turn!`, level: `success` }))
        dispatch({ type: game.CHANGE_TURN, turn: newTurn })
      }
      else
        dispatch({ type: game.CHANGE_TURN, turn: otherTurn({ turn: newTurn })})
    }
  }
}

// ============================================================================
// Game Reducer
// ============================================================================

export const defaultState = {
  gState: GAME_STATES.NEW,
  gems: [],
  wells: [],
  turn: PLAYER._1,
}

export default function reduceGame(state = defaultState, action) {
  let update

  switch (action.type) {
    // ------------------------------------------------------------------------
    case game.NEW_GAME:
      update = { gState: GAME_STATES.NEW }
      break

    // ------------------------------------------------------------------------
    case game.START_GAME:
      let newGems = []
      let newWells = []
      let gemWells = {}
      for(let id = 0; id < GAME.NUM_WELLS; id++) {
        let player = id < (GAME.NUM_WELLS / 2) ? PLAYER._1 : PLAYER._2
        let type = [ GAME.TRAY[PLAYER._1], GAME.TRAY[PLAYER._2] ]
          .includes(id) ? TRAY_TYPE.TRAY : TRAY_TYPE.WELL
        newWells = [ ...newWells, { id, player, gems: [], type } ]
      }
      for(let id = 0; id < GAME.NUM_GEMS; id++) {
        let offset = (id < GAME.NUM_GEMS / 2) ? 0 : GAME.NUM_WELLS / 2
        let well = action.setup === 'random' ? randomInRange({ min: 0, max: (GAME.NUM_WELLS / 2) - 2 }) : id % 6
        let finalWell = offset + well
        newWells[finalWell].gems = [ ...newWells[finalWell].gems, id ]
        newGems = [ ...newGems, { id } ]
      }
      update = {
        gState: GAME_STATES.PLAYING,
        gems: newGems,
        wells: newWells,
        turn: defaultState.turn,
      }
      break

    // ------------------------------------------------------------------------
    case game.FINISH_GAME:
      update = { gState: GAME_STATES.DONE }
      break

    // ------------------------------------------------------------------------
    case game.MAKE_MOVE:
      let nextWell = (action.well + 1) % GAME.NUM_WELLS
      update = {
        wells: {
          [action.well] : {
            gems: state.wells[action.well].gems.slice(1),
          },
          [nextWell] : {
            gems: [
              ...state.wells[nextWell].gems,
              state.wells[action.well].gems[0],
            ],
          },
        }
      }
      break

    // ------------------------------------------------------------------------
    case game.CHANGE_TURN:
      update = { turn: action.turn }
      break

    // ------------------------------------------------------------------------
    case game.CAPTURE_WELL:
      let trayId = GAME.TRAY[state.turn]
      update = {
        wells: {
          [trayId] : {
            gems: [ ...state.wells[trayId].gems, ...state.wells[action.well].gems ],
          },
          [action.well] : { gems: [] },
        },
      }
      break
  }
  return update ? u(update, state) : state
}
