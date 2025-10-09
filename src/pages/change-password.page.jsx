import { useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InputBox from "../components/ui/InputBox"
import toast, { Toaster } from "react-hot-toast"
import { validarPassword } from "../libs/utils"
import { useAuth } from "../context/AuthContext"

const ChangePassword = () => {
  const { passwordChange, errors, user: {id} } = useAuth()
  let changePasswordForm = useRef()

  const handleSubmit = async(e) => {
    e.preventDefault();

    let form = new FormData(changePasswordForm.current)
    let formData = { }

    for(let [key, value] of form.entries()) {
      formData[key] = value
    }

    let {currentPassword, newPassword} = formData

    if (!currentPassword?.length || !newPassword?.length) {
      return toast.error("Campos Vacíos")
    }

    const passValidate = validarPassword(newPassword)
    if( !passValidate.valido) {
      return toast.error(passValidate.mensaje)
    }

    e.target.setAttribute("disabled", true)
    let loadingToast = toast.loading("Actualizando...")
    try {
      const updatePass = await passwordChange(newPassword, currentPassword, id)
      toast.dismiss(loadingToast)
      e.target.removeAttribute("disabled")
      toast.success("Contraseña Actualizada")
      changePasswordForm.current.reset()
    } catch (err) {
      toast.dismiss(loadingToast)
      e.target.removeAttribute("disabled")
      console.log(err)
      toast.error(err.message)
    }

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