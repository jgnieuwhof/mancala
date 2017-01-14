import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap'

import { setUserName } from 'reducers/reduceUser'
import { newGame } from 'reducers/reduceGame'

class Triage extends Component {
  state = {
    name: '',
    nameState: `error`,
  }

  componentDidMount = () => {
    this.name.focus()
  }

  validateName = (name) => {
    if (name.length < 2) { return `error` }
    else if (name.length < 6) { return `warning` }
    return `success`
  }

  nameChange = (e) => {
    let name = e.target.value
    let nameState = this.validateName(name)
    this.setState({ name, nameState })
  }

  submit = (e) => {
    e.preventDefault()
    let { name, nameState } = this.state
    let { dispatch } = this.props
    if (nameState === `success`) {
      dispatch(setUserName(name))
      dispatch(newGame())
    }
  }

  render = () => {
    let { nameState } = this.state
    return (
      <Grid>
        <Col sm={6} smOffset={3}>
          <form onSubmit={this.submit}>
            <FormGroup controlId="screenName" validationState={nameState} >
              <ControlLabel>
                { nameState !== `success` && `username must be at least 6 characters` }
                { nameState === `success` && `username looks good` }
              </ControlLabel>
              <FormControl
                type="text"
                bsSize="sm"
                inputRef={ref => { this.name = ref }}
                value={this.state.name}
                placeholder="username"
                onChange={this.nameChange}
              />
            </FormGroup>
          </form>
        </Col>
      </Grid>
    )
  }
}

export default connect()(Triage)
