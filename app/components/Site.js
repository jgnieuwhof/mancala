import React from 'react'
import Helmet from 'react-helmet'

export default ({ children }) => {
  let faviconConfig = [{
    rel: "icon",
    href: require('../img/favicon.ico'),
    type: "img/ico",
  }]

  return (
    <div>
      <Helmet link={faviconConfig} />
      <div>{ children }</div>
    </div>
  )
}
