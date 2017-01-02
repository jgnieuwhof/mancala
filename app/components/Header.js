import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { abandonGame } from 'reducers/reduceGame'

const Header = ({ dispatch }) => {
  return (
    <div className="header">
      <div className="container container-maximize">
        <div className="logo text-center">@jgnieuwhof - Mancala</div>
        <div className="pull-right new-game">
          <Button onClick={() => { dispatch(abandonGame()) }}>New Game</Button>
        </div>
      </div>
    </div>
  )
}

export default connect()(Header)
