import React, { Component } from 'react'

import { randomInCircle } from 'helpers/maths'

export default class Gem extends Component {
  state = {
    offset: randomInCircle(),
  }

  render = () => {
    let padding = 30
    let { dims } = this.props
    let { offset } = this.state
    let radius = dims.height / 10
    let offsetX = Math.round(offset.x * (dims.width - padding) / 2)
    let offsetY = Math.round(offset.y * (dims.height - padding) / 2)
    let style = {
      left: Math.round(dims.left + (dims.width / 2) - radius + offsetX),
      top: Math.round(dims.top + (dims.height / 2) - radius + offsetY),
      width: radius * 2,
      height: radius * 2,
    }
    return (
      <div className="gem" style={style} />
    )
  }
}
