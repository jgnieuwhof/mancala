import React, { Component } from 'react'
import { connect } from 'react-redux'

import { GAME_STATES, PLAYER } from 'constants'

import Board from 'components/Board'
import Start from 'components/Start'
import withSocket from 'components/with/socket'
import { newGame, startGame } from 'reducers/reduceGame'

class Game extends Component {

  newGame = () => {
    this.props.dispatch(newGame())
  }

  matchMade = ({ gems, player1 }) => {
    let { settings, dispatch, socket } = this.props
    let player = player1 === socket.id ? PLAYER._1 : PLAYER._2
    dispatch(startGame({ settings, gems, player }))
  }

  componentDidMount = () => {
    let { socket } = this.props
    socket.on(`server::abandoned`, this.newGame)
    socket.on(`server::matchMade`, this.matchMade)
  }

  componentWillUnmount = () => {
    let { socket } = this.props
    socket.off(`server::abandoned`, this.newGame)
    socket.off(`server::matchMade`, this.matchMade)
  }

  render = () => {
    let { gState } = this.props
    return (
      <div className="game">
        { gState === GAME_STATES.NEW &&
          <Start text={`Begin!`} />
        }
        { gState === GAME_STATES.MATCHMAKING &&
          <div className="text-center">
            <h2>Matchmaking...</h2>
          </div>
        }
        { gState === GAME_STATES.PLAYING &&
          <Board />
        }
        { gState === GAME_STATES.DONE &&
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
    gState: state.game.gState,
    settings: state.game.settings,
  }
}

export default withSocket(connect(mapStateToProps)(Game))
