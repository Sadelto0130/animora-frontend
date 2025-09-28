import {Navigate, Outlet} from "react-router-dom";

// registerTo: a dónde redirigir si el usuario NO tiene permiso
export const ProtectedRoute = ({registerTo, isAllowed, children}) => {

  if(!isAllowed) return <Navigate to={registerTo} replace />;

  return children ? children : <Outlet />;
}