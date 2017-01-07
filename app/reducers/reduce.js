
import { combineReducers } from 'redux'

import reduceGame from 'reducers/reduceGame'
import reduceUser from 'reducers/reduceUser'

let reducers = {
  game: reduceGame,
  user: reduceUser,
}

let finalReducer = combineReducers(reducers)

export default finalReducer
