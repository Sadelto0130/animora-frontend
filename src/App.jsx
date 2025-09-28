import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import HomePage from "./pages/home.page";
import ProfilePage from "./pages/profile.page";
import Editor from "./pages/editor.pages";
import { useAuth } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import { ProtectedRoute } from "./ui/ProtectedRoute";
import SearchPage from "./pages/search.page";
import NotFoundPage from "./pages/404.page";
import BlogPage from "./pages/blog.page";

const App = () => {
  const { isAuth, loading, user } = useAuth();

  return (
    <>
      <BlogProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="post/:post_slug" element={<BlogPage />} />

          <Route
            element={
              <ProtectedRoute isAllowed={!isAuth} registerTo="/" />
            }
          >
            <Route path="login" element={<UserAuthForm type="login" />} />
            <Route path="register" element={<UserAuthForm type="register" />} />
          </Route>

          <Route element={<ProtectedRoute isAllowed={isAuth} registerTo="/" />}>
            <Route path="editor" element={<Editor />} />
            <Route path="editor/:slug" element={<Editor />} />
            <Route path="user_profile/:user_name" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BlogProvider>
    </>
  );
};

export default App;
