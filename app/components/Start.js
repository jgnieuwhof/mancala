import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'

import { startGame } from 'reducers/reduceGame'

class Start extends Component {
  state = {
    setup: 'normal',
  }

  start = () => {
    let { setup } = this.state
    this.props.dispatch(startGame({ setup }))
  }

  render = () => {
    return (
      <div className="start container">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
            <ButtonGroup>
              <Button active={this.state['setup']==='normal'} onClick={() => { this.setState({ setup: 'normal' })}}>Normal</Button>
              <Button active={this.state['setup']==='random'} onClick={() => { this.setState({ setup: 'random' })}}>Random</Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <a className="big-button" onClick={this.start}>{ this.props.text }</a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Start)
