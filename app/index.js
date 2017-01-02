import 'babel-polyfill'

import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import NotificationSystem from 'react-notification-system'
import io from 'socket.io-client'

import Routes from 'components/Routes'
import SocketProvider from 'components/SocketProvider'

import finalReducer from 'reducers/reduce'

const SOCKET = io(API_URL)

let thunkArg = {
  notificationSystem: {},
  socket: SOCKET
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
        <SocketProvider socket={SOCKET}>
          <Router history={browserHistory}>
            { Routes }
          </Router>
        </SocketProvider>
      </Provider>
      <NotificationSystem ref={ref => { thunkArg.notificationSystem = ref }}/>
    </div>,
    root
  )
}
