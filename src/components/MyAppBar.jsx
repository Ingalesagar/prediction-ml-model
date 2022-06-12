import * as React from 'react'
import { Typography } from 'antd'
const left = [['Home', '/']]

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
}
function MyAppBar() {
  return (
    <div
      className="head"
      style={{
        backgroundColor: '#242F9B',
        color: 'white',
      }}
    >
      <div
        className="wrapper"
        style={{
          maxWidth: '1300px',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '80px',
        }}
      >
        <div className="left">
          {left.map((el, i) => (
            <a key={'' + i + el[0] + el[1]} href={el[1]} style={linkStyle}>
              {el[0]}
            </a>
          ))}
        </div>
        <div className="middle">
          <Typography.Title style={{ margin: '0px', color: 'inherit' }}>
            ML Model
          </Typography.Title>
        </div>
        <div className="right">
          {/* <a href="" style={linkStyle}>
            Settings
          </a> */}
        </div>
      </div>
    </div>
  )
}

export default MyAppBar
