import React from 'react'
import {  Route } from 'react-router'

import Site from 'components/Site'
import App from 'components/App'
import Game from 'components/Game'

export default (
  <Route path="/" component={Site}>
    <Route path="/" component={App}>
      <Route path="new" component={Game} />
    </Route>
  </Route>
)
