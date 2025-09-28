import React from 'react'
import { getFullDate } from '../../libs/utils.js'

const AboutUser = ({ bio, email, create, className}) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className='text-xl leading-7'>{bio ? bio : "Nada para leer en la bio"}</p>
      <p className='text-xl leading-7 mt-3 mb-3'>Contacto: {email}</p>
      <p className='text-xl leading-7 text-dark-grey'>Cuenta creada el {getFullDate(create)}</p>
    </div>
  )
}

export default AboutUser