import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { newGame } from 'reducers/reduceGame'

class Header extends Component {
  render = () => {
    return (
      <div className="header">
        <div className="container container-maximize">
          <div className="logo text-center">@jgnieuwhof - Mancala</div>
          <div className="pull-right new-game">
            <Button onClick={() => {this.props.dispatch(newGame())}}>New Game</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Header)
