import React, { Component } from 'react'
import { connect } from 'react-redux'

import { PLAYER } from 'constants'
import UserDetails from 'components/UserDetails'
import withSocket from 'components/with/socket'
import { isTray, isActiveWell } from 'helpers/game'
import { makeMove } from 'reducers/reduceGame'

class Well extends Component {
  onClick = () => {
    let { well, turn, socket, player1, userId, dispatch } = this.props
    let player = player1.id === userId ? PLAYER._1 : PLAYER._2
    if (isActiveWell({ well, player, turn })) {
      let { id: start } = well
      socket.emit(`client::makeMove`, { start })
      dispatch(makeMove({ start }))
    }
  }

  render = () => {
    let { well, dims, turn, userId, player1, player2 } = this.props
    let player = player1.id === userId ? PLAYER._1 : PLAYER._2
    let turnClass = isActiveWell({ well, player, turn }) ? `turn-${turn}` : ``
    let trayPlayer = isTray(well.id)
    return (
      <div
        style={{...dims}}
        className={trayPlayer ? `tray` : `well ${turnClass}`}
        onClick={this.onClick}
      >
        <span className="well-count">{well.gems.length}</span>
        { trayPlayer &&
          <UserDetails
            player={trayPlayer}
            turn={turn}
            wellDims={dims}
            user={trayPlayer === PLAYER._1 ?  player1 : player2 }
          />
        }
      </div>
    )
  }
}

export default withSocket(connect(state => ({
  turn: state.game.turn,
  player1: state.game.player1,
  player2: state.game.player2,
  userId: state.user.id,
}))(Well))
