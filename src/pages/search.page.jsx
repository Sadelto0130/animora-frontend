import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog/blog-post.component";
import LoadMorePostsBtn from "../components/ui/load-more.component";
import NoDataMessage from "../components/ui/nodata.component";
import Loader from "../components/ui/Loader";
import UserCardWrapper from "../components/profile/UserCardWrapper";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";

const SearchPage = () => {
  const { isAuth } = useAuth();
  const { getPostBySearch, getUsersBySearch } = useBlog();

  const [offset, setOffset] = useState(0);
  const [load, setLoad] = useState(false);
  const limit = 5;
  let { query } = useParams();
  let [blogs, setBlogs] = useState([]); // traer los blogs que coincidan con la busqueda
  let [postToShow, setPostToShow] = useState(5);

  const loadMorePosts = async () => {
    const newOffset = offset + limit;

    await getPostBySearch(limit, newOffset, query);
    setOffset(newOffset);
  };

  useEffect(() => {
    const fetchSearchPosts = async () => {
      try {
        setLoad(true);
        const result = await getPostBySearch(limit, offset, query);

        if (result === undefined || result.length === 0) {
          setBlogs([]);
          setLoad(false);
          return;
        }
        setLoad(false);
        setBlogs(result);
      } catch (error) {
        console.error("Error al buscar posts:", error);
      }
    };
    fetchSearchPosts();
  }, [query]);

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Buscando resultados para: ${query}`, (isAuth ? "Cuentas de Usuarios" : "Inicie sesion para buscar por usuarios")]}
          defaultHidden={"Cuentas de Usuarios"}
        >
          <>
            {load === true ? (
              <Loader />
            ) : blogs.length === 0 ? (
              <NoDataMessage message={"La búsqueda no obtuvo resultados"} />
            ) : (
              blogs.slice(0, postToShow).map((post, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard contenido={post} autor={post.users} />
                  </AnimationWrapper>
                );
              })
            )}

            {blogs.length < 5 ? (
              ""
            ) : blogs.length <= postToShow ? (
              <p className="text-[#303336] p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
                No hay más posts para mostrar...
                <a href="#inicio">
                  Volver al inicio
                  <i className="fi fi-sr-up text-[#303336]"></i>
                </a>
              </p>
            ) : (
              <LoadMorePostsBtn setPostToShow={setPostToShow} />
            )}
          </>
          {isAuth ? <UserCardWrapper query={query} /> : ""}
        </InPageNavigation>
      </div>
      
      {
        isAuth ?  ( 
        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-[#c9c9c99a] pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8">
            Usuarios encontrados <i className="fi fi-rr-user"></i>
          </h1>
          <UserCardWrapper query={query} />
        </div>
        ) : ""
      }
    </section>
  );
};

export default SearchPage;
