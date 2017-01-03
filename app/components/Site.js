import React from 'react'
import Helmet from 'react-helmet'

import Header from 'components/Header'
import Game from 'components/Game'

export default () => {
  let faviconConfig = [{
    rel: "icon",
    href: require('../img/favicon.ico'),
    type: "img/ico",
  }]

  return (
    <div>
      <Helmet link={faviconConfig} />
      <Header />
      <div className="body">
        <Game />
      </div>
    </div>
  )
}
