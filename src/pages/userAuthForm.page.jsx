import React, { useEffect } from "react";
import InputBox from "../components/ui/InputBox";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimationWrapper from "../common/page-animation";
import { json } from "zod";
import { useForm } from "react-hook-form";
import { authWithGoogle } from "../common/firebase";
import toast from "react-hot-toast";

const UserAuthForm = ({ type }) => {
  const {
    registerUser,
    loginUser,
    clearRegisterErrors,
    google_login,
    google_register,
    errors: registerErrors,
  } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (type === "register") {
        await registerUser(data);
      } else {
        await loginUser(data);
      }
    } catch (error) {
      console.error("Error en el formulario: ", error);
    }
  });

  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    try {
      const {google_token, userData} = await authWithGoogle()

      if(type === "register") {
        google_register(google_token, userData)
      } else {
        google_login(google_token)
      }
    } catch (error) {
      toast.error("Error al autenticar con Google")
      console.error("Error al autenticar con Google:", error)
    }
  };

  useEffect(() => {
    if (registerErrors) {
      const timer = setTimeout(() => {
        clearErrors();
        clearRegisterErrors();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [registerErrors, clearErrors, clearRegisterErrors]);

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]" onSubmit={onSubmit}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-16">
            {type == "login"
              ? "Bienvenido de nuevo"
              : "Unete a nuestra comunidad"}
          </h1>

          {registerErrors &&
            registerErrors.map((err, i) => (
              <p
                key={i} 
                className="text-white text-center bg-red rounded-md p-2 mb-4"
              >
                {err}
              </p>
            ))}

          {/* Campos solo para registro */}
          {type !== "login" ? (
            <>
              <InputBox
                name="name"
                type="text"
                placeholder="Nombre"
                icon="fi-rr-user"
                register={register}
                rules={{ required: "El nombre es obligatorio" }}
                error={errors.name}
              />

              <InputBox
                name="last_name"
                type="text"
                placeholder="Apellido"
                icon="fi-rr-user"
                register={register}
                rules={{ required: "El apellido es obligatorio" }}
                error={errors.last_name}
              />
            </>
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
            register={register}
            rules={{ required: "El email es obligatorio" }}
            error={errors.email}
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Contraseña"
            icon="fi-rr-key"
            register={register}
            rules={{ required: "La contraseña es obligatoria" }}
            error={errors.password}
          />

          {type !== "login" ? (
            <>
              <InputBox
                name="confirm_password"
                type="password"
                placeholder="Confirma la contraseña"
                icon="fi-rr-key"
                register={register}
                rules={{
                  required: "Las contraseñas no coinciden",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                }}
                error={errors.confirm_password}
              />

              {errors.confirm_password && (
                <p className="text-red text-xl mt-2 text-center">
                  {errors.confirm_password.message}
                </p>
              )}
            </>
          ) : (
            ""
          )}

          <button className="btn-dark center mt-14">{type}</button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>o</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            Continua con google
          </button>

          {type === "login" ? (
            <p className="mt-4 text-dark-grey text-xl text-center">
              ¿No tienes una cuenta?
              <Link
                to="/register"
                className="underline text-black text-xl ml-1"
              >
                Regístrate
              </Link>
            </p>
          ) : (
            <p className="mt-4 text-dark-grey text-xl text-center">
              ¿Ya tienes una cuenta?
              <Link to="/login" className="underline text-black text-xl ml-1">
                Inicia sesión
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
