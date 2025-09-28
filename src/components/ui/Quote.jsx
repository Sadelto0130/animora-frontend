import React from 'react'

const Quote = ({quote, caption}) => {
  return (
    <div className='bg-[#ace0e9] p-3 pl-5 border-l-4 border-[#45757e]'>
      <p 
        className='text-xl leading-10 md:text-2xl' 
        dangerouslySetInnerHTML={{ __html: quote }}
      />
      {caption?.length ? <p className='w-full text-[#5f8b8b] text-base'>{caption}</p> : ""}
    </div>
  )
}

export default Quote