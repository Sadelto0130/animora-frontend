import { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'
import { array, set } from 'zod'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import { getProfileByUserName } from '../api/users.api'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error('useAuth deberia estar dentro de un provider')
  }
  return context;
}

export function AuthProvider({ children}) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const registerUser = async (data) => {
    setLoading(true)
    setErrors(null)
    try {
      const userData = {...data}
      delete userData.confirm_password;

      const res = await axios.post("/register", userData);
      setUser(res.data)
      setIsAuth(true);
      setLoading(false)
      return res.data;
    } catch (error) {
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)
      }
      setErrors([error.response.data.message])
    }
  }

  const loginUser = async (data) => {
    setErrors(null)
    setLoading(true)
    try {
      const res = await axios.post("/login", data)

      setUser(res.data)
      setIsAuth(true);

      setLoading(false)
      navigate("/")
      return res.data;
    } catch (error) {
      setLoading(false)
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)
      } 
      setErrors([error.response.data.message])
    }
  }

  const logout = async () => {
    await axios.post("/logout");
    setUser(null)
    setIsAuth(false)
    setErrors(null)
    navigate("/")
  }

  const google_login = async (data) => {
    try {
      const google_token = data
      const res = await axios.post('/google_login_user', {google_token})
      setUser(res.data)
      setIsAuth(true);
      return res.data
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un error
        if (Array.isArray(error.response.data)) {
          return setErrors(error.response.data);
        }
        setErrors([error.response.data.message || "Error desconocido en el servidor"]);
      } else if (error.request) {
        // La request salió pero no hubo respuesta
        setErrors(["No hubo respuesta del servidor"]);
      } else {
        // Algo pasó antes de enviar la request
        setErrors([error.message]);
      }
    }
  }

  const google_register = async (data) => {
    setErrors[null]
    try {
      const google_token = data
      const res = await axios.post("/google_register_user", {google_token});
      setUser(res.data)
      setIsAuth(true);
      return res.data;
    } catch (error) {
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)
      }
      setErrors([error.response.data.message])
    }
  }

  const getUserByUserName = async (user_name) => {
    try {
      const res = await getProfileByUserName(user_name);
      return res.data; 
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const clearRegisterErrors = () => setErrors(null)

  useEffect(() => {
    const checkAuth = async () => {
      const PUBLIC_ROUTES = ["/login", "/register"];
      const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

      if(isPublicRoute) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true)
        const res = await axios.get("/me");
        setUser(res.data);
        setIsAuth(true);
      } catch (error) {
        try {
          setLoading(true)
          await axios.get("/refresh_token", {withCredentials: true});
          const res = await axios.get("/me", {withCredentials: true});
          setUser(res.data);
          setIsAuth(true);
        } catch (error) {
          setUser(null);
          setIsAuth(false);
        }
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [])

  if (loading) return <Loader />;
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuth,
        loading,
        errors,
        clearRegisterErrors,
        registerUser,
        loginUser,
        logout, 
        google_login,
        google_register,
        getUserByUserName
      }}>
      {children}
    </AuthContext.Provider>
  )
}
