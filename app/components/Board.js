import React, { Component } from 'react'
import { connect } from 'react-redux'

import Gem from 'components/Gem'
import Well from 'components/Well'
import withSocket from 'components/with/socket'
import { GAME } from 'constants'
import { isTray } from 'helpers/game'
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

  render = () => {
    let { wells, gems, height, width } = this.props
    let numRows = (GAME.NUM_WELLS / 2) + 1
    let numWellRows = numRows - 2
    let padding = 20
    let boardHeight = height - (padding * 2)
    let dim = { width: boardHeight * 0.4, height: boardHeight }
    let vertSpace = (dim.height / numRows) - 2
    let wellDims = wells.reduce((obj, well) => {
      let wellDim = {}
      let vertPos = well.id < numRows - 2 ? well.id : GAME.NUM_WELLS - 2 - well.id
      let wellDiameter = Math.round((dim.height / numRows) - 10)
      if (isTray(well.id)) {
        let trayWidth = dim.width - 20
        wellDim = {
          left: (dim.width / 2) - (trayWidth / 2),
          top: well.id === numWellRows ? vertSpace * (numRows - 1) : 0,
          width: trayWidth,
          height: wellDiameter,
        }
      }
      else {
        let offset = (dim.width / 4) * (well.id < numWellRows ? -1 : 1)
        wellDim = {
          left: (dim.width / 2) - (wellDiameter / 2) + offset,
          top: vertSpace * (vertPos + 1),
          width: wellDiameter,
          height: wellDiameter,
        }
      }
      return { ...obj, [well.id]: { ...wellDim }, }
    }, {})

    let style = {
      width: dim.width,
      height: dim.height,
      top: padding,
      left: (width / 2) - (dim.width / 2),
    }

    return (
      <div className="board" style={style}>
        <div className="wells">
          { wells.map(well => {
            return <Well key={well.id} well={well} dims={wellDims[well.id]} />
          })}
        </div>
        <div className="gems">
          { gems.map(gem => {
            let gemWell = wells.find(w => (w.gems.includes(gem.id)))
            return <Gem key={gem.id} dims={wellDims[gemWell.id]} />
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
