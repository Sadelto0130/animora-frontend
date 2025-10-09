import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast'
import Loader from '../components/ui/Loader'
import AnimationWrapper from '../common/page-animation'

const EditProfile = () => {
  const {user, getUserByUserName} = useAuth()
  const [profileState, setProfileState] = useState()
  const [load, setLoad] = useState(false)
  
  const {name, last_name, user_name, email, bio} = profileState || {}
  useEffect(()=> {
    const dataUser = async() => {
      setLoad(true)
      const userData = await getUserByUserName(user.user_name);
      if(!userData) {
        setLoad(false)
        toast.error("Usuario no encontrado")
        return
      }
      setProfileState(userData)
    }
    dataUser()
  }, [user.user_name])

  console.log(profileState)
  if(!load) return <Loader />
  return (
    <AnimationWrapper>    
      <form>
        <Toaster/>
        <h1 className="max-md:hidden">Editar Perfil</h1>

        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
          <div className="max-lg:enter mb-5">
            <label htmlFor='uploadImage' id='profileImg'>
              <img src={profileState?.avatar_url}/>
            </label>
            <input type="file" id="uploadImage" accept='.jpeg, .png, .jpg' hidden/>
          </div>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default EditProfile