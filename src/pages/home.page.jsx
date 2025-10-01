import React, { useEffect, useState } from "react";
import { useBlog } from "../context/BlogContext";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/blog/BlogPostCard";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/ui/nodata.component";
import LoadMorePostsBtn from "../components/ui/load-more.component";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const {
    allPosts,
    getAllPosts,
    getPostsTrending,
    getCountAllTags,
    getAllPostByTag,
  } = useBlog();
  const {user} = useAuth()

  let [postBlog, setPostBlog] = useState(allPosts || []);
  let [trendingPosts, setTrendingPosts] = useState(null);
  let [categorias, setCategorias] = useState([]);
  let [pageState, setPageState] = useState("home");
  let [categoriasToShow, setCategoriasToShow] = useState(9);
  let [postToShow, setPostToShow] = useState(5);
  let [load, setLoad] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const loadBlogCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setPostBlog([]);

    if (pageState === category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  const loadMorePosts = async () => {
    const newOffset = offset + limit;
    
    await getAllPosts(limit, newOffset);
    setOffset(newOffset);
  };

  useEffect(() => {
    activeTabRef.current.click(); // cambia el tamaño del hr en el titulo

    const posts = async () => {
      try {
        if (pageState === "home") {
          setLoad(true)
          const resultPost = await getAllPosts();
          setPostBlog(resultPost);
          setLoad(false)
        } else {
          setLoad(true)
          const resultPost = await getAllPostByTag(pageState);
          setPostBlog(resultPost || []);
          setPostToShow(5);
          setLoad(false)
        }

        if (!trendingPosts) {
          const postsTrending = await getPostsTrending();
          setTrendingPosts(postsTrending);

          const tags = await getCountAllTags();
          const tagNames = tags.map((t) => t.tag);
          setCategorias(tagNames);
        }
      } catch (error) {
        console.error("Error al cargar los posts");
      }
    };
    posts();
  }, [pageState]);

  useEffect(() => {
  if (pageState === "home") {
    setPostBlog(allPosts); 
  }
}, [allPosts, pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Blogs por fecha */}
        <div className="w-full" id="inicio">
          <InPageNavigation
            routes={[pageState, "Tendencias"]}
            defaultHidden={["Tendencias"]}
          >
            <>
              {load === true ? 
              (
                <Loader />
              ) : allPosts.length === 0 ? (
                <NoDataMessage message={"No hay posts en esta categoria"} />
              ) : (
                postBlog.slice(0, postToShow).map((post, i) => {
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
              {
                allPosts.length < 5 ? "" : 
                allPosts.length <= postToShow ?
                  <p className='text-[#303336] p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                    No hay más posts para mostrar...
                    <a href="#inicio">
                      Volver al inicio
                      <i className="fi fi-sr-up text-[#303336]"></i>
                    </a>
                  </p>
                : 
                  <LoadMorePostsBtn 
                    onClick={() => {
                          setPostToShow((prev) => prev + 5);
                          loadMorePosts();
                        }} 
                  />
              }
            </>

            {trendingPosts === null ? (
              <Loader />
            ) : (
              trendingPosts.map((post, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost post={post} index={i} />
                  </AnimationWrapper>
                );
              })
            )}
          </InPageNavigation>
        </div>

        {/* Categorias y tendencias */}
        {categorias === null ? (
          <Loader />
        ) : (
          <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-medium text-xl mb-8">Categorias</h1>
                <div className="flex gap-3 flex-wrap">
                  {categorias.slice(0, categoriasToShow).map((categoria, i) => {
                    return (
                      <button
                        onClick={loadBlogCategory}
                        className={
                          "tag " +
                          (pageState === categoria
                            ? " bg-black text-white "
                            : " ")
                        }
                        key={i}
                      >
                        {categoria}
                      </button>
                    );
                  })}
                </div>
                {categoriasToShow < categorias.length && (
                  <button
                    onClick={() => setCategoriasToShow((prev) => prev + 10)}
                    className="btn-dark px-3 py-1 text-sm mt-2 rounded-full right-10"
                  >
                    Ver más
                  </button>
                )}
                {categoriasToShow > 10 && (
                  <button
                    onClick={() => setCategoriasToShow((prev) => prev - 10)}
                    className="btn-dark px-3 py-1 text-sm mx-4 mt-2 rounded-full right-10"
                  >
                    Ver menos
                  </button>
                )}
              </div>

              <div>
                <h1 className="font-medium-text-xl mb-8">
                  Trending  
                  <i className="fi fi-br-arrow-trend-up"></i>
                </h1>
                {trendingPosts === null ? (
                  <Loader />
                ) : (
                  trendingPosts.map((post, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogPost post={post} index={i} />
                      </AnimationWrapper>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
