import React from 'react'

interface TitleProps {
    first : string,
    second : string
}
const Title = ({first, second} : TitleProps) => {
  return (
    <div>
      <h1 className='font-medium text-3xl'>
        {first} <span className='text-rose-500'>{second}</span>
      </h1>
    </div>
  )
}

export default Title