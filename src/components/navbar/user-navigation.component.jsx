import { Link } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation"
import { useAuth } from "../../context/AuthContext";

const UserNavigationPanel = () => {

  const {user, logoutUser} = useAuth()

  return (
    <AnimationWrapper
    className="absolute right-0 z-50"
      transition={{duration: 0.2}}    
    >
      <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Escribir</p>
        </Link>
        <Link to={`/user_profile/${user.user_name}`} className="link pl-8 py-4">
          Perfil
        </Link>
        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to="/settings" className="link pl-8 py-4">
          Configuración
        </Link>

        <span className="absolute border-t border-grey w-[100%]"></span>

        <button 
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={logoutUser}
        >
          <h1 className="font-bold text-xl mg-1">Salir</h1>
          <p className="text-dark-grey">@{user.name}</p>
        </button>
      </div>
    </AnimationWrapper>
  )
}

export default UserNavigationPanel;