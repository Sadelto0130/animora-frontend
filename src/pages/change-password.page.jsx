import { useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InputBox from "../components/ui/InputBox"
import { Toaster } from "react-hot-toast"

const ChangePassword = () => {
  let changePasswordForm = useRef()

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Cambio de Contraseña</h1>
        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox 
            name="currentPassword" 
            type="password" 
            className="profile-edit-input"
            placeholder="Contraseña Actual"
            icon="fi-rr-unlock"
          />

          <InputBox 
            name="newPassword" 
            type="password" 
            className="profile-edit-input"
            placeholder="Contraseña Nueva"
            icon="fi-rr-unlock"
          />

          <button 
            onClick={handleSubmit}
            className="btn-dark px-10" 
            type="submit"
          >Cambiar Contraseña</button>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default ChangePassword