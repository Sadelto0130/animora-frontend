import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth }from "../../context/AuthContext"

const SideNav = () => {
  const {user} = useAuth()
  const location = useLocation()

  const [pageState, setPageState] = useState("")
  const [showSideNav, setShowSideNav] = useState(true)

  let activeTabLine = useRef()
  let sideBarIconTab = useRef()
  let pageStateTab = useRef()

  const changePageSate = (e) => {
    let { offsetWidth, offsetLeft } = e.target

    activeTabLine.current.style.width = offsetWidth + "px"
    activeTabLine.current.style.left = offsetLeft + "px"

    if( e.target === sideBarIconTab.current) {
      setShowSideNav(true)
    } else {
      setShowSideNav(false)
    }
  }

  useEffect(()=>{
    let page = location?.pathname?.split('/')[2]
    if (!page) {
      setShowSideNav(true);
      setPageState("");
    } else {
      setPageState(decodeURIComponent(page.replace("_", " ")));
      setShowSideNav(false);
    }
  }, [location])

  useEffect(() => {
  if (pageState) {
    setShowSideNav(false);
    pageStateTab?.current?.click();
  }
}, [pageState]);

  return (
    <>
      <section className="relative flex gap-10 py-0 m 0 max-md:flex-col">
        <div className="sticky top-[80px] z-30">

          <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
            <button ref={sideBarIconTab} className='p-5 capitalize' onClick={changePageSate}>
              <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
            </button>
            {pageState.length === 0 ? "" : <button ref={pageStateTab} className='p-5 capitalize' onClick={changePageSate}>
              {pageState}
            </button>}
            <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
          </div>
          <div className={'min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ' + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>

            <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />

            <NavLink 
              to="/dashboard/blogs" 
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-document"></i>
              Blogs
            </NavLink>

            <NavLink 
              to="/dashboard/notificaciones" 
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-bell"></i>
              Notificaciones
            </NavLink>

            <NavLink 
              to="/editor" 
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-file-edit"></i>
              Escribir
            </NavLink>

            <h1 className="text-xl text-dark-grey mt-20 mb-3">Configuracion</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />

            <NavLink 
              to="/settings/editar_perfil" 
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-user"></i>
              Editar Perfil
            </NavLink>

            {!user.google_auth && <NavLink 
              to="/settings/cambiar_contraseña" 
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-lock"></i>
              Cambiar Contraseña
            </NavLink>}

          </div>
        </div>
        <div className="max-md:-mt-8 mt-5 w-full">
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default SideNav