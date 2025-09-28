import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { TfiWrite } from "react-icons/tfi";
import { MdOutlinePets } from "react-icons/md";
import logo from "../../imgs/logo.png";
import { useAuth } from "../../context/AuthContext";
import UserNavigationPanel from "../profile/user-navigation.component";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { user, isAuth } = useAuth();

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleSearch = (e) => {
    let query = e.target.value;
    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
      setSearchQuery("");
      setSearchBoxVisibility(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <FaSearch />
          <img src={logo} className="w-full" alt="Logo" />
        </Link>

        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" />
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <CiSearch className="text-xl text-dark-grey" />
          </button>

          <Link
            to="/adoptantes"
            className="bg-grey md:bg-transparent md:flex items-center justify-center gap-2 link rounded-full md:-mr-4 hover:bg-black/10"
          >
            <MdOutlinePets className="text-2xl block mt-1 text-[#000000d7]" />
            <p className="hidden md:block">Adoptantes</p>
          </Link>

          {isAuth ? (
            <>
              <Link
                to="/editor"
                className="hidden md:flex gap-2 link rounded-full"
              >
                <i className="fi fi-rr-file-edit"></i>
                <p>Escribir</p>
              </Link>
              <Link to="/dashboard/notification">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                </button>
              </Link>
              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={user.avatar_url.replace(/;/g, "")}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full border border-black"
                  />
                </button>
                {userNavPanel ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/login">
                Login
              </Link>

              <Link className="btn-light py-2 hidden md:block" to="/register">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
