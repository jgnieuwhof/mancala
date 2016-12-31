import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { GAME_STATES } from 'constants'

import Board from 'components/Board'
import Start from 'components/Start'

import { newGame } from 'reducers/reduceGame'

class Game extends Component {

  render = () => {
    let {
      dispatch,
      game
    } = this.props

    return (
      <div className="game">
        { game.gState === GAME_STATES.NEW &&
          <Start text={`Begin!`} />
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

export default connect(mapStateToProps)(Game)
