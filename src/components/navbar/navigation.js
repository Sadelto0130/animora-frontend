import { useAuth } from "../../context/AuthContext"

const {user} = useAuth()

export const publicRoutes = [
  {
    name: "Login",
    path: "/login"
  },
  {
    name: "Register",
    path: "/register"
  }
]

export const privateRoutes = [
  {
    name: "Profile",
    path: `/user_profile/${user?.id}`
  },
  {
    name: "Publicaciones",
    path: "/publicaciones"
  },
  {
    name: "Escribir",
    path: "/write"
  }
]