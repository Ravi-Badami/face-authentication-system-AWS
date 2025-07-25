import React from 'react'
import './style.css' // Import the CSS file for styles
const Button = ({text}) => {
  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="style.css" />
  <button>
    <div className="button-outer">
      <div className="button-inner">
        <span>{text}</span>
      </div>
    </div>
  </button>
</>

  )
}

export default Button