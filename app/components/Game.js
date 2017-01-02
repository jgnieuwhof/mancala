import React, { Component } from 'react'
import { connect } from 'react-redux'

import { GAME_STATES } from 'constants'

import Board from 'components/Board'
import Start from 'components/Start'
import withSocket from 'components/with/socket'

import { newGame } from 'reducers/reduceGame'

class Game extends Component {
  componentDidMount = () => {
    let { socket, dispatch } = this.props
    socket.on(`server::abandoned`, () => {
      dispatch(newGame())
    })
  }

  render = () => {
    let { game } = this.props
    return (
      <div className="game">
        { game.gState === GAME_STATES.NEW &&
          <Start text={`Begin!`} />
        }
        { game.gState === GAME_STATES.MATCHMAKING &&
          <div className="text-center">
            <h2>Matchmaking...</h2>
          </div>
        }
        { game.gState === GAME_STATES.PLAYING &&
          <Board />
        }
        { game.gState === GAME_STATES.DONE &&
          <div>
            <Start text={`Play Again!`} />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    game: state.game,
  }
}

export default withSocket(connect(mapStateToProps)(Game))
