import React, { Component } from 'react'
import { connect } from 'react-redux'

import { GAME_STATES, PLAYER } from 'constants'
import Board from 'components/Board'
import Start from 'components/Start'
import Triage from 'components/Triage'
import withSocket from 'components/with/socket'
import { newGame, startGame, enterTriage } from 'reducers/reduceGame'
import { setUsername } from 'reducers/reduceUser'

class Game extends Component {
  state = {
    view: { width: 0, height: 0 },
  }

  componentWillMount = () => {
    let { dispatch } = this.props
    if (localStorage.username) {
      dispatch(setUsername({ username: localStorage.username }))
      dispatch(newGame())
    }
    else {
      dispatch(enterTriage())
    }
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

  newGame = () => {
    this.props.dispatch(newGame())
  }

  matchMade = ({ gems, player1, player2 }) => {
    let { settings, dispatch } = this.props
    dispatch(startGame({ settings, gems, player1, player2 }))
  }

  render = () => {
    let { gState, myself, opponent, player } = this.props
    // <div className="game-username player-1 pull-left">{ player === PLAYER._1 ?  myself.username : opponent.username }</div>
    // <div className="game-username player-2 pull-right">{ player === PLAYER._2 ?  myself.username : opponent.username }</div>
    return (
      <div className="game" ref={r => {this.gameView = r}}>
        { gState === GAME_STATES.TRIAGE &&
          <Triage />
        }
        { gState === GAME_STATES.NEW &&
          <Start text={`Begin!`} />
        }
        { gState === GAME_STATES.MATCHMAKING &&
          <div className="text-center">
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
    player: state.game.player,
    myself: state.game.myself,
    opponent: state.game.opponent,
  }
}

export default withSocket(connect(mapStateToProps)(Game))
