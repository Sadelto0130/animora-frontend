import React from 'react'

const Img = ({url, caption}) => {
  return (
    <div>
      <img src={url}/>
      {caption.length ? 
      <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{caption}</p> 
      : ""}
    </div>
  )
}

export default Img