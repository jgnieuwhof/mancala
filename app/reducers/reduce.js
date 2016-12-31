
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

import reduceGame from 'reducers/reduceGame'

let reducers = {
  game: reduceGame,
}

let finalReducer = combineReducers(reducers)

export default finalReducer
