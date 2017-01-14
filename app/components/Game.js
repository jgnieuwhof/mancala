import React, { Component } from 'react'
import { connect } from 'react-redux'

import { GAME_STATES } from 'constants'
import Board from 'components/Board'
import Start from 'components/Start'
import Triage from 'components/Triage'
import withSocket from 'components/with/socket'
import { newGame, startGame, enterTriage } from 'reducers/reduceGame'
import { setUserName, setUserId } from 'reducers/reduceUser'

class Game extends Component {
  state = {
    view: { width: 0, height: 0 },
  }

  newGame = () => {
    this.props.dispatch(newGame())
  }

  matchMade = ({ gems, player1, player2 }) => {
    let { settings, dispatch } = this.props
    dispatch(startGame({ settings, gems, player1, player2 }))
  }

  connectionMade = () => {
    let { dispatch, socket } = this.props
    dispatch(setUserId(socket.id))
  }

  connectionLost = () => {
    this.props.dispatch(setUserId(null))
  }

  componentWillMount = () => {
    let { dispatch, socket } = this.props
    if (localStorage.username) {
      dispatch(setUserName(localStorage.username))
      dispatch(newGame())
    }
    else {
      dispatch(enterTriage())
    }
    socket.on(`connect`, this.connectionMade)
    socket.on(`disconnect`, this.connectionLost)
  }

  componentDidMount = () => {
    let { socket } = this.props
    socket.on(`server::abandoned`, this.newGame)
    socket.on(`server::matchMade`, this.matchMade)
    window.addEventListener(`resize`, this.updateGameView)
    this.updateGameView()
  }

  componentWillUnmount = () => {
    let { socket } = this.props
    socket.off(`server::abandoned`, this.newGame)
    socket.off(`server::matchMade`, this.matchMade)
    socket.off(`connect`, this.connectionMade)
    socket.off(`disconnect`, this.connectionLost)
    window.removeEventListener(`resize`, this.updateGameView)
  }

  updateGameView = () => {
    this.setState({
      view: {
        width: this.gameView.clientWidth,
        height: this.gameView.clientHeight,
      },
    })
  }

  render = () => {
    let { gState } = this.props
    return (
      <div className="game" ref={r => {this.gameView = r}}>
        { gState === GAME_STATES.TRIAGE &&
          <Triage />
        }
        { gState === GAME_STATES.NEW &&
          <Start text={`Begin!`} />
        }
        { gState === GAME_STATES.MATCHMAKING &&
          <div className="container text-center">
            <h2>Matchmaking...</h2>
          </div>
        }
        { gState === GAME_STATES.PLAYING &&
          <Board height={this.state.view.height} width={this.state.view.width} />
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
