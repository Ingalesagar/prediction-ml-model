import * as React from 'react'
import MyAppBar from './MyAppBar'

function MainContainer({ children }) {
  return (
    <div className="main">
      <MyAppBar />
      <div
        className="chid"
        style={{
          maxWidth: '1300px',
          margin: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default MainContainer
