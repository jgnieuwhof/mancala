import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { GAME_STATES } from 'constants'
import { abandonGame } from 'reducers/reduceGame'

const Header = ({ dispatch, gState, username }) => {
  return (
    <div className="header">
      <div className="container container-maximize">
        <div className="pull-left username">{ username }</div>
        <div className="logo text-center">@jgnieuwhof - Mancala</div>
        { ![GAME_STATES.TRIAGE, GAME_STATES.NEW].includes(gState) &&
          <div className="pull-right new-game">
            <Button onClick={() => { dispatch(abandonGame()) }}>New Game</Button>
          </div>
        }
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    gState: state.game.gState,
    username: state.user.username,
  }
}

export default connect(mapStateToProps)(Header)
