
import u from 'updeep'

import { game } from 'actions'
import { GAME_STATES, PLAYER, GAME, TRAY_TYPE } from 'constants'

import { otherTurn, isPlayerWell } from 'helpers/game'
import { addNotification } from 'helpers/notification'

// ============================================================================
// Game Action Creators
// ============================================================================

export const newGame = () => {
  return (dispatch) => {
    dispatch({ type: game.NEW_GAME })
  }
}

export const abandonGame = () => {
  return (dispatch, getState, { socket }) => {
    let { game: { gState } } = getState()
    if (gState !== GAME_STATES.NEW) {
      socket.emit(`client::abandonGame`)
    }
    dispatch(newGame())
  }
}

export const startMatchMaking = () => {
  return (dispatch) => {
    dispatch({ type: game.START_MATCHMAKING })
  }
}

export const startGame = ({ settings, gems, player }) => {
  return (dispatch) => {
    dispatch({
      type: game.START_GAME,
      setup: settings.setup,
      gems, player
    })
  }
}

export const makeMove = ({ start }) => {
  return (dispatch, getState, { socket }) => {
    let { game: { turn, wells } } = getState()
    let nMoves = wells[start].gems.length
    let finalWell = (start + nMoves) % GAME.NUM_WELLS

    // Move all gems from one well to the next, leaving behind one each time
    for(let i = 0; i < nMoves; i++) {
      let currentWell = (start + i) % GAME.NUM_WELLS
      for(let j = 0; j < (nMoves - i); j++) {
        dispatch({ type: game.MAKE_MOVE, well: currentWell })
      }
    }

    // Let's check if we captured a well, and capture if so
    let isCurPlayerWell = isPlayerWell({ wellId: finalWell, player: turn })
    let correspondingWell = (GAME.NUM_WELLS - 2) - finalWell
    if (isCurPlayerWell && wells[finalWell].gems.length === 0 && wells[correspondingWell].gems.length > 0) {
      dispatch({ type: game.CAPTURE_WELL, well: finalWell })
      dispatch({ type: game.CAPTURE_WELL, well: correspondingWell })
      dispatch(addNotification({ message: `Captured!`, level: `success`  }))
    }

    // Any pieces left?
    // If not did the last piece end in the player's tray?
    // Also account for the next player not having any pieces to move
    wells = getState().game.wells // refresh our wells
    if (!wells.some(w => (w.type === TRAY_TYPE.WELL && w.gems.length > 0))) {
      socket.emit(`client::finishGame`)
      dispatch({ type: game.FINISH_GAME })
    }
    else {
      let hasFreeTurn = finalWell === GAME.TRAY[turn]
      if (!hasFreeTurn)
        turn = otherTurn({ turn })
      if (!wells.some(w => isPlayerWell({ wellId: w.id, player: turn }) && w.gems.length > 0))
        turn = otherTurn({ turn })
      else if (hasFreeTurn)
        dispatch(addNotification({ message: `Free turn!`, level: `success` }))
      dispatch({ type: game.CHANGE_TURN, turn })
    }
  }
}

export const updateSettings = (update) => {
  return (dispatch) => {
    dispatch({ type: game.UPDATE_SETTINGS, update })
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
  player: null,
  settings: {
    setup: 'normal',
  },
}

export default function reduceGame(state = defaultState, action) {
  let update

  switch (action.type) {
    // ------------------------------------------------------------------------
    case game.NEW_GAME:
      update = { gState: GAME_STATES.NEW }
      break

    // ------------------------------------------------------------------------
    case game.UPDATE_SETTINGS:
      update = { settings: action.update }
      break

    // ------------------------------------------------------------------------
    case game.START_MATCHMAKING:
      update = { gState: GAME_STATES.MATCHMAKING }
      break

    // ------------------------------------------------------------------------
    case game.START_GAME:
      let newWells = []
      for(let id = 0; id < GAME.NUM_WELLS; id++) {
        let player = id < (GAME.NUM_WELLS / 2) ? PLAYER._1 : PLAYER._2
        let type = [ GAME.TRAY[PLAYER._1], GAME.TRAY[PLAYER._2] ]
          .includes(id) ? TRAY_TYPE.TRAY : TRAY_TYPE.WELL
        newWells = [ ...newWells, { id, player, gems: [], type } ]
      }
      let newGems = Object.keys(action.gems).map(gemId => {
        let well = action.gems[gemId]
        newWells[well].gems = [ ...newWells[well].gems, gemId ]
        return { id: gemId }
      })
      update = {
        gState: GAME_STATES.PLAYING,
        gems: newGems,
        wells: newWells,
        turn: defaultState.turn,
        player: action.player,
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
