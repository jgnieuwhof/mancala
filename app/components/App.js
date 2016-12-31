import React from 'react'

import Header from 'components/Header'

export default ({ children }) => {
  return (
    <div>
      <Header />
      <div className="body">{ children }</div>
    </div>
  )
}