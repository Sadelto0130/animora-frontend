import { useEffect, useState } from "react";
import { getDay } from "../../libs/utils.js";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const BlogPostCard = ({ contenido, autor }) => {
  const {user} = useAuth()
  const [liked, setLiked] = useState(false)
  const {countLikes} = useBlog()
  let {
    created_at,
    title,
    tags,
    content,
    liked_by,
    total_likes,
    banner,
    slug, 
    post_id,
  } = contenido;
  let { name, last_name, avatar_url, user_name } = autor;

  let fullName = `${name} ${last_name}`;
  const likeCount = countLikes[post_id] ?? Number(total_likes);

  useEffect(() => {
    if(!user) return;
    if(liked_by[0]?.id === user?.id) {
      setLiked(true)
    }
  }, [liked])

  return (
    <Link to={`/post/${slug}`} className="flex gap-8 items-center border-b border-[#a0a0a0] pb-5 mb-4">
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={avatar_url !== null ? avatar_url : ""} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullName} @{user_name}
          </p>
          <p className="min-w-fit">{getDay(created_at)}</p>
          { (contenido.user_id === autor.id && contenido.draft) ?
            <p className="ml-auto text-grey rounded-full bg-dark-grey p-1">Borrador</p> : ""
          }
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[110px]:hidden line-clamp-2">
          {content.length > 1
            ? content[0].data.text
            : "No hay contenido para mostrar"}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className={"fi " + (liked ? "fi-sr-heart text-red" : "fi-rr-heart ")}></i>
            {likeCount}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey">
        <img src={banner} className="w-full h-full aspect-square object-cover" />        
      </div>
    </Link>
  );
};

export default BlogPostCard;
