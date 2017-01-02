import React, { Component } from 'react'
import { connect } from 'react-redux'

import { GAME } from 'constants'

import Gem from 'components/Gem'

import { makeMove, nextTurn } from 'reducers/reduceGame'

class Board extends Component {

  onWellClick = ({ id }) => {
    let { wells, turn, dispatch } = this.props
    let well = wells[id]
    if (well.player === turn && well.gems.length > 0) {
      let { id: start, gems: { length: nMoves } } = well
      dispatch(makeMove({ start: well.id }))
      dispatch(nextTurn({ start, nMoves }))
    }
  }

  render = () => {
    let { wells, gems, turn } = this.props
    let boardDim = { width: 325, height: 760 }
    let wellDim = { width: 80, height: 80 }
    let trayDim = { width: 300, height: 80 }
    let numRows = (GAME.NUM_WELLS / 2) + 1
    let vertSpace = (boardDim.height / numRows) - 2
    let wellMeta = wells.reduce((obj, well) => {
      let turnClass = turn === well.player ? `turn-${turn}` : ``
      let style, className, onClick
      if (well.id === 6) {
        style = {
          left: (boardDim.width / 2) - (trayDim.width / 2),
          top: vertSpace * (numRows - 1),
          width: trayDim.width,
          height: trayDim.height,
        }
        className = `tray ${turnClass}`
      }
      else if (well.id === 13) {
        style = {
          left: (boardDim.width / 2) - (trayDim.width / 2),
          top: 0,
          width: trayDim.width,
          height: trayDim.height,
        }
        className = `tray ${turnClass}`
      }
      else {
        let offset = (boardDim.width / 4) * (well.id < 6 ? -1 : 1)
        let vertPos = well.id < 6 ? well.id : 12 - well.id
        style = {
          left: (boardDim.width / 2) - (wellDim.width / 2) + offset,
          top: vertSpace * (vertPos + 1),
          width: wellDim.width,
          height: wellDim.height,
        }
        className = `well ${turnClass}`
        onClick = () => { this.onWellClick({ id: well.id }) }
      }
      obj[well.id] = { style, className, onClick }
      return obj
    }, {})
    return (
      <div className="board" style={{ width: `${boardDim.width}px`, height: `${boardDim.height}px` }}>
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
  }
}

export default connect(mapStateToProps)(Board)
