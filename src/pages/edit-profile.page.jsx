import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/ui/Loader";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/ui/InputBox";
import { uploadImage } from "../common/aws";
import { validarUsuario } from "../libs/utils";

const EditProfile = () => {
  const { user, getUserByUserName, updateProfileImg} = useAuth();
  let bioLimit = 150;
  let profileImgEle = useRef()
  let editProfileForm = useRef()

  const [profileState, setProfileState] = useState({});
  const [load, setLoad] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(bioLimit);
  const [updateImg, setUpdateImg] = useState(null)

  const { name, last_name, user_name, email, bio, social_links } =
    profileState || {};
    
    const handleCharacterChange = (e) => {
      setCharacterLimit(bioLimit - e.target.value.length);
    };

    const handleImagePreview = (e) => {
      let img = e.target.files[0]

      profileImgEle.current.src = URL.createObjectURL(img)

      setUpdateImg(img)
    }

    const handleImgUpload = async(e) => {
      e.preventDefault()

      if(updateImg) {
        let loadingToast = toast.loading("Cargando...")
        e.target.setAttribute("disabled", true)

      try {
        const imgURL = await uploadImage(updateImg);
        const respImg = await updateProfileImg(imgURL, profileState.id)

        if (respImg) {
          toast.dismiss(loadingToast);
          toast.success("Imagen cargada exitosamente");
          profileImgEle.current.src = imgURL;
        }
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        toast.dismiss(loadingToast);
        toast.error("Error subiendo imagen");
      }

      }
    }

    const handleProfileUpdate = (e) => {
      e.preventDefault()

      let form = new FormData(editProfileForm.current)
      let formData = { }
      const re = /[^a-zA-Z0-9]{4,30}/

      for(let [key, value] of form.entries()) {
        formData[key] = value
      }

      let { user_name, bio, facebook, instagram, website, youtube } = formData

      const validateUser = validarUsuario(user_name)
      if(!validateUser.valido) return toast.error(validateUser.mensaje)
      
      if(bio.length > bioLimit) return toast.error(`La bio supera los ${bioLimit} caracteres`)

      let loadingToast = toast.loading("Cargando...")
      e.target.setAttribute("disabled", true)
    }
    
    useEffect(() => {
      if (!profileState) return setLoad(true);
      const dataUser = async () => {
        setLoad(true);
        const userData = await getUserByUserName(user.user_name);
        if (!userData) {
          setLoad(false);
          toast.error("Usuario no encontrado");
          return;
        }
        setProfileState(userData);
      };
      dataUser();
    }, [user]);
    
  //console.log(profileState) 
  if (!load) return <Loader />;
  return (
    <AnimationWrapper>
      <form ref={editProfileForm}>
        <Toaster />
        <h1 className="max-md:hidden">Editar Perfil</h1>

        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
          <div className="max-lg:center mb-5">
            <label
              htmlFor="uploadImage"
              id="profileImg"
              className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden border border-dark-grey"
            >
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                Subir Imagen
              </div>
              <img ref={profileImgEle} src={profileState?.avatar_url} />
            </label>
            <input
              type="file"
              id="uploadImage"
              accept=".jpeg, .png, .jpg"
              hidden
              onChange={handleImagePreview}
            />
            <button 
              className="btn-light mt-5 max-lg:center lg:w-full px-10 hover:bg-dark-grey/30"
              onClick={handleImgUpload}
            >
              Cargar
            </button>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <div>
                <InputBox
                  name="name"
                  type="text"
                  value= {name && last_name ? `${name} ${last_name}` : ""}
                  placeholder="Nombre"
                  disabled={true}
                  icon="fi-rr-user"
                />
              </div>
              <div>
                <InputBox
                  name="email"
                  type="email"
                  value={email}
                  placeholder="Email"
                  disabled={true}
                  icon="fi-rr-envelope"
                />
              </div>
            </div>

            <InputBox
              type="text"
              name="user_name"
              value={user_name}
              placeholder="Nombre de usuario"
              icon="fi-rr-at"
            />
            <p className="text-dark-grey -mt-3">
              El nombre de usuario es publico y se usa para búsquedas.
            </p>

            <textarea
              name="bio"
              maxLength={bioLimit}
              defaultValue={bio}
              className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
              placeholder="Sobre mí"
              onChange={handleCharacterChange}
            ></textarea>
            <p className="mt-1 text-dark-grey">
              Quedan {characterLimit} caracteres disponibles
            </p>

            <p className="m-6 text-dark-grey">Agrega tus redes sociales</p>

            <div className="md:grid md:grid-cols-2 gap-x-6">
              {Array.isArray(social_links) &&
                social_links.map((link, i) => {
                  const icon =
                    link.platform_name !== "website"
                      ? "fi-brands-" + link.platform_name
                      : "fi-rr-globe";
                  return (
                    <InputBox
                      key={link.id || i}
                      name={link.platform_name}
                      type="text"
                      value={link.url}
                      placeholder={"https://" + link.platform_name}
                      icon={icon}
                    />
                  );
                })}
            </div>

            <button 
              onClick={handleProfileUpdate}
              className="btn-dark w-auto px-10" 
              type="submit"
            >Actualizar</button>
          </div>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default EditProfile;
