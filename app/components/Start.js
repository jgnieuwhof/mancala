import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'

import withSocket from 'components/with/socket'
import { generateGemPositions } from 'helpers/game'
import { startMatchMaking, updateSettings } from 'reducers/reduceGame'

class Start extends Component {
  updateSetup = (setup) => {
    this.props.dispatch(updateSettings({ setup }))
  }

  start = () => {
    let { dispatch, socket, settings } = this.props
    let gems = generateGemPositions({ setup: settings.setup })
    socket.emit(`client::findOpponent`, { settings, gems })
    dispatch(startMatchMaking())
  }

  render = () => {
    let { settings: { setup } } = this.props
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

function mapStateToProps(state) {
  return {
    settings: state.game.settings,
  }
}

export default withSocket(connect(mapStateToProps)(Start))
