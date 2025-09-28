import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/ui/Loader";
import AboutUser from "../components/profile/about.component";
import BlogPostCard from "../components/blog/blog-post.component";
import NoDataMessage from "../components/ui/nodata.component";
import LoadMorePostsBtn from "../components/ui/load-more.component";
import { useBlog } from "../context/BlogContext";
import NotFoundPage from "./404.page";

const ProfilePage = () => {
  const { getUserByUserName, user } = useAuth();
  const { getUserPost } = useBlog()
  const { user_name } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [load, setLoad] = useState(false)
  const [sumarLikes, setSumarLikes] = useState(0);
  const [sumarReads, setSumarReads] = useState(0);
  let [postToShow, setPostToShow] = useState(5);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const loadMorePosts = async () => {
    const newOffset = offset + limit;
    
    await getUserPost(userPosts.id, limit, newOffset);
    setOffset(newOffset);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoad(true)
      const userData = await getUserByUserName(user_name);
      if(!userData) {
        setLoad(false)
        return
      } 

      const dataBlogs = await getUserPost(userData.id, limit, offset)

      if(dataBlogs?.length === 0) {
        setLoad(false)
        setUserPosts([])
      }
      setUserProfile(userData);
      setUserPosts(dataBlogs)
        
      setLoad(false)
    };
    fetchUser();
  }, [user_name]);

  useEffect(() => {
    if(userPosts?.length > 0){
      setSumarLikes(userPosts.reduce((total, post) => total + parseInt(post.total_likes), 0));
      setSumarReads(userPosts.reduce((total, post) => total + post.read_count, 0));
    } else {
      setSumarLikes(0);
      setSumarReads(0);
    }
  }, [userPosts]);

  return (
    <AnimationWrapper>
      {
        load ? <Loader/> : 
        userProfile ?
          (  <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
              <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[40%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10" >
                <img src={userProfile.avatar_url?.replace(/;/g, "")} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"/>

                <h1 className="text-2xl font-medium">@{userProfile.user_name}</h1>

                <p className="text-xl capitalize h-6">{userProfile.name} {userProfile.last_name}</p>

                <p>{userPosts?.length} Posts - {sumarLikes.toLocaleString()} Likes - {sumarReads.toLocaleString()} Visitas</p>

                <div className="flex gap-4 mt-2">
                  {user.id === userProfile.id && (
                    <Link to="/settings/editar_perfil" className="btn-light rounded-md">Editar perfil</Link>
                  ) }
                </div>

                <AboutUser className="max-md:hidden" bio={userProfile.bio} email={userProfile.email} create={userProfile.created_at}/>
              </div>

              <div className="max-md:mt-12 w-full">

              <InPageNavigation
                routes={["Publicaciones", "Acerca de"]}
                defaultHidden={["Acerca de"]}
              >
                <>
                  {load === true ? 
                  (
                    <Loader />
                  ) : userPosts.length === 0 ? (
                    <NoDataMessage message={"No tiene post publicados"} />
                  ) : (
                    userPosts?.slice(0, postToShow).map((post, i) => {
                      return (
                        <AnimationWrapper
                          transition={{ duration: 1, delay: i * 0.1 }}
                          key={i}
                        >
                          <BlogPostCard contenido={post} autor={userProfile} />
                        </AnimationWrapper>
                      );
                    })
                  )}
                  {
                    userPosts.length <= 4 ? "" :
                    userPosts.length < postToShow ?
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

                <AboutUser bio={userProfile.bio} email={userProfile.email} create={userProfile.created_at}/>

              </InPageNavigation>

              </div>
            </section>
          )
        : <NotFoundPage/>
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
