import React, { Component } from 'react'
import { connect } from 'react-redux'

import Gem from 'components/Gem'
import withSocket from 'components/with/socket'
import { GAME } from 'constants'
import { isActiveWell } from 'helpers/game'
import { makeMove } from 'reducers/reduceGame'

class Board extends Component {

  makeMove = ({ start }) => {
    this.props.dispatch(makeMove({ start }))
  }

  componentDidMount = () => {
    this.props.socket.on(`server::makeMove`, this.makeMove)
  }

  componentWillUnmount = () => {
    this.props.socket.off(`server::makeMove`)
  }

  onWellClick = ({ id: start }) => {
    let { wells, turn, player, socket } = this.props
    if (isActiveWell({ well: wells[start], player, turn })) {
      socket.emit(`client::makeMove`, { start })
      this.makeMove({ start })
    }
  }

  render = () => {
    let { wells, gems, turn, player, height, width } = this.props
    let numRows = (GAME.NUM_WELLS / 2) + 1
    let numWellRows = (GAME.NUM_WELLS / 2) - 1
    let padding = 20
    height -= (padding * 2)
    let boardDim = { width: height * 0.4, height }
    let wellDim = Math.round((height / numRows) - 10)
    let trayDim = { width: boardDim.width - 20, height: wellDim }
    let vertSpace = (boardDim.height / numRows) - 2
    let wellMeta = wells.reduce((obj, well) => {
      let turnClass = isActiveWell({ well, player, turn }) ? `turn-${turn}` : ``
      let style, className, onClick
      if (well.id === numWellRows || well.id === GAME.NUM_WELLS - 1) {
        style = {
          left: (boardDim.width / 2) - (trayDim.width / 2),
          top: well.id === numWellRows ? vertSpace * (numRows - 1) : 0,
          width: trayDim.width,
          height: trayDim.height,
        }
        className = `tray`
      }
      else {
        let offset = (boardDim.width / 4) * (well.id < numWellRows ? -1 : 1)
        let vertPos = well.id < numWellRows ? well.id : GAME.NUM_WELLS - 2 - well.id
        style = {
          left: (boardDim.width / 2) - (wellDim / 2) + offset,
          top: vertSpace * (vertPos + 1),
          width: wellDim, height: wellDim,
        }
        className = `well ${turnClass}`
        onClick = () => { this.onWellClick({ id: well.id }) }
      }
      return { ...obj, [well.id]: { style, className, onClick } }
    }, {})
    let boardStyle = {
      width: boardDim.width,
      height: boardDim.height,
      top: padding,
      left: (width / 2) - (boardDim.width / 2),
    }
    return (
      <div className="board" style={boardStyle}>
        <div className="wells">
          { wells.map(well => (
            <div key={well.id} { ...wellMeta[well.id] } >
              <span className="well-count">{well.gems.length}</span>
            </div>
          ))}
        </div>
        <div className="gems">
          { gems.map(gem => {
            let gemWell = wells.find(w => (w.gems.includes(gem.id)))
            let { style } = wellMeta[gemWell.id]
            return <Gem key={gem.id} dims={style} />
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    wells: state.game.wells,
    gems: state.game.gems,
    turn: state.game.turn,
    player: state.game.player,
  }
}

export default withSocket(connect(mapStateToProps)(Board))
