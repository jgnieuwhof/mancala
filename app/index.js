import 'babel-polyfill'

import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import NotificationSystem from 'react-notification-system'

import Routes from 'components/Routes'

import finalReducer from 'reducers/reduce'

let thunkArg = {
  notificationSystem: {},
}

const finalCreateStore = compose(
  applyMiddleware(thunk.withExtraArgument(thunkArg)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const STORE = finalCreateStore(finalReducer)

window.onload = () => {
  let root = document.createElement(`div`)
  document.body.appendChild(root)

  ReactDOM.render(
    <div>
      <Provider store={STORE}>
        <Router history={browserHistory}>
          { Routes }
        </Router>
      </Provider>
      <NotificationSystem ref={ref => { thunkArg.notificationSystem = ref }}/>
    </div>,
    root
  )
}
