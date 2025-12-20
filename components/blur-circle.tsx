import React from 'react'

const BlurCircle = ({top = "auto", left = "auto", bottom = "auto", right = "auto"}) => {
  return (
    <div className="absolute h-60 w-60 -z-50 aspect-square rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20" style={{top : top, left : left, bottom : bottom, right : right}}></div>
  )
}

export default BlurCircle
