import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'

import { PLAYER } from 'constants'
import withSocket from 'components/with/socket'
import { generateGemPositions } from 'helpers/game'
import { startGame, startMatchMaking } from 'reducers/reduceGame'

class Start extends Component {
  state = {
    settings: {
      setup: 'normal',
    },
  }

  componentDidMount = () => {
    let { settings } = this.state
    let { socket, dispatch } = this.props
    socket.on(`server::matchMade`, ({ gems, player1 }) => {
      let player = player1 === socket.id ? PLAYER._1 : PLAYER._2
      dispatch(startGame({ settings, gems, player }))
    })
  }

  updateSetup = (setup) => {
    this.setState({ settings: { ...this.state.settings, setup } })
  }

  start = () => {
    let { settings } = this.state
    let { dispatch, socket } = this.props
    let gems = generateGemPositions({ setup: settings.setup })
    socket.emit(`client::findOpponent`, { settings, gems })
    dispatch(startMatchMaking())
  }

  render = () => {
    let { settings: { setup } } = this.state
    return (
      <div className="start container">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-sm-offset-2 text-center">
              <ButtonGroup>
                <Button active={setup === 'normal'} onClick={() => { this.updateSetup('normal')}}>Normal</Button>
                <Button active={setup === 'random'} onClick={() => { this.updateSetup('random')}}>Random</Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <a className="big-button" onClick={this.start}>{ this.props.text }</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withSocket(connect()(Start))
