import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import toast, { Toaster } from "react-hot-toast";

const BlogInteraction = ({ post }) => {
  const { user } = useAuth();
  const {
    setEditorState,
    likePostUser,
    desLikePostUser,
    setComentarios,
    countComments
  } = useBlog();
  
  const [countLike, setCountLike] = useState(parseInt(post?.total_likes) || 0);
  const [liked, setLiked] = useState(false);

  const { post_id, total_likes, title, users, total_comments, slug, liked_by } =
    post || {};

  const handleLike = async () => {
    if (!user) {
      toast.error("Debe estar registrado para dar like");
      return;
    }
    if (!liked) {
      await likePostUser(post_id, user.id);
      setCountLike((prev) => prev + 1);
      setLiked(true);
    } else {
      await desLikePostUser(post_id, user.id);
      setCountLike((prev) => (prev > 0 ? prev - 1 : 0));
      setLiked(false);
    }
  };


  useEffect(() => {
    if (!user) return;
    if (liked_by?.some((u) => u.id === user?.id)) {
      setLiked(true);
    }
  }, [user, liked_by]);


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
          <p>{countLike}</p>

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
