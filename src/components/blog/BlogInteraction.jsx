import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import toast, { Toaster } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const BlogInteraction = ({ post }) => {
  const socket = useSocket()
  const { user } = useAuth();
  const {
    setEditorState,
    likePostUser,
    desLikePostUser,
    setComentarios,
    countComments,
    setCountLikes,
    countLikes,
    updateLikes
  } = useBlog();
  
  //const [totalCountLike, setTotalCountLike] = useState(parseInt(post?.total_likes) || countLikes);
  const [liked, setLiked] = useState(false);
  const { post_id, title, users, slug, liked_by } =
  post || {};
  const likeCount = countLikes[post_id] ?? Number(post.total_likes);

  const handleLike = async () => {
    if (!user) {
      toast.error("Debe estar registrado para dar like");
      return;
    }

    try {
      if (!liked) {
        await likePostUser(post_id, user.id);
      } else {
        await desLikePostUser(post_id, user.id);
      }
      setLiked(preVal => !preVal );
    } catch (error) {
      console.error(err);
      toast.error("Error al actualizar el like");
    }
  };


  useEffect(() => {
    if (!user || !socket) return;

    if (liked_by?.some((u) => u.id === user?.id)) {
      setLiked(true);
    }
    
    const handleLikePost = (data) => {
      if(Number(data.id) === Number(post_id)) {
        setCountLikes(data.likes_count)
      }
    }

    const handleDislikePost = (data) => {
      if(Number(data.id) === Number(post_id)) {
        setCountLikes(data.likes_count)
      }
    }
  }, [user, socket, post_id, liked_by, setCountLikes]);

  useEffect(() => {
    if (post?.total_likes !== undefined) {
      setCountLikes(Number(post.total_likes));
    }
  }, [post, setCountLikes]);

  return (
    <>
      <Toaster />
      <hr className="border-[#dfdfdf] my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={
              "w-10 h-10 rounded-full flex items-center justify-center bg-[#dfdfdf]"
            }
            onClick={handleLike}
          >
            <i
              className={
                "fi " + (liked ? "fi-sr-heart text-red" : "fi-rr-heart ")
              }
            ></i>
          </button>
          <p>{likeCount}</p>

          <button 
            onClick={() => setComentarios(preVal => !preVal)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dfdfdf]"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p>
            {countComments}
          </p>
        </div>

        <div className="flex gap-6 items-center">
          {user === null ? (
            ""
          ) : user.id === users?.id ? (
            <Link
              to={`/editor/${slug}`}
              className="underline hover:text-purple"
              onClick={() => {
                setEditorState("editor");
              }}
            >
              Editar
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
          <Link
            to={`https://www.facebook.com/sharer/sharer.php?u=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-facebook text-xl hover:text-[#1877F2]"></i>
          </Link>
        </div>
      </div>
      <hr className="border-[#dfdfdf] my-2" />
    </>
  );
};

export default BlogInteraction;
