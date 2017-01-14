import React from 'react'

let UserDetails = props => {
  let { player, user, turn } = props
  let className = `user-details ${player} ${turn === player ? 'active' : ''}`
  return (
    <div className={className}>{ user.username }</div>
  )
}

export default UserDetails
