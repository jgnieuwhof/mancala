import React from 'react'

import { PLAYER } from 'constants'

let UserDetails = props => {
  let { player, user, turn, wellDims } = props
  let className = `user-details ${player} ${turn === player ? 'active' : ''}`
  let fontSize = Math.round(wellDims.height / 5)
  let style = {
    fontSize: (fontSize < 10) ? 10 : fontSize,
    width: wellDims.width,
    height: wellDims.height,
  }
  let offset = Math.round((style.width + 30) * -1)
  if (player === PLAYER._1) {
    style = { ...style, left: offset }
  }
  else {
    style = { ...style, right: offset - 10 }
  }
  return (
    <div style={style} className={className}>{ user.username }</div>
  )
}

export default UserDetails
