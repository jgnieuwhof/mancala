import React, { Component } from 'react'

import { randomInCircle } from 'helpers/maths'

const radius = 10
const padding = 30

export default class Gem extends Component {
  state = {
    offset: {},
  }

  positionFromDims = ({ left, top, width, height, offset }) => {
    let { x, y } = offset
    return {
      left: Math.round(left + (width / 2) - radius + x),
      top: Math.round(top + (height / 2) - radius + y),
      width: radius * 2,
      height: radius * 2,
    }
  }

  constructor(props) {
    super(props)
    let { dims: { width, height } } = props
    let offset = randomInCircle({ width, height, padding })
    this.state = { ...this.state, offset }
  }

  render = () => {
    let { dims } = this.props
    let { left, top, width, height } = this.positionFromDims({ ...dims, offset: this.state.offset })
    let style = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    }
    return (
      <div className="gem" style={style} />
    )
  }
}
