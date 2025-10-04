import React, { useEffect, useState } from "react";
import { useBlog } from "../../context/BlogContext";
import CommentsField from "./CommentsField";
import NoDataMessage from "../ui/nodata.component";
import { useSocket } from "../../context/SocketContext";
import AnimationWrapper from "../../common/page-animation";
import CommentCard from "./CommentCard"

const CommentsContainer = () => {
  let {
    comentarios,
    setComentarios,
    totalComentariosPadres,
    setTotalComentariosPadres,
    getCommentsPost,
    allComments,
    setAllComments,
    posts: {title, post_id}
  } = useBlog();
  const socket = useSocket()
  const [showComments, setShowComments] = useState(10);
  const [offset, setOffset] = useState(0);
  let limit = 100;

  
  const loadMoreComments = async () => {
    const moreComments = await getCommentsPost(post_id, limit, offset);

    if(moreComments?.length) {
      setAllComments(prev => [...prev, moreComments])
      setOffset(prev => prev + limit); 
    }
  };

  useEffect(() => {
    if(!post_id) return 
    const getAllComments = async () => {
      const commentsData = await getCommentsPost(post_id)
      setAllComments(commentsData?.content || [])
    }
    getAllComments()
  }, [post_id])

  // trae nuevos comentarios en tiempo real
  useEffect(() => {
    if(!socket) return

    const handleNewComment = (newComment) => {
      if (newComment.post_id === post_id) {
        setAllComments((prev) => [newComment, ...prev])
      }
    }

    socket.on("update-comments", handleNewComment)
    return () => socket.off("update-comments", handleNewComment)
  }, [post_id])
  
  return (
    <div 
      className={"max-sm:w-full fixed " + ( comentarios ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comentarios</h1>
        <p className="text-lg mt-2 w-[70%] text-dak-grey line-clamp-1">{title}</p>
        <button 
          onClick={()=> setComentarios(preVal => !preVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>
      <hr className="border-grey my-8 w-[120%] -ml-10"/>

      <CommentsField action="comentar" idPost={post_id}/>

      {
        allComments && allComments?.length 
          ? allComments.slice(0, showComments).map((comment, i) => {
            return <AnimationWrapper key={comment.comment_id}>
              <CommentCard index={i} leftVal={comment.level * 4} comment = {comment}/>
            </AnimationWrapper>
          }) 
          : <NoDataMessage message = "Sin comentarios aun"/>
      }

      { 
        allComments?.length > showComments ?
        <button
          onClick={() => {
            // muestra primero todo el array
            if(showComments + 10 <= allComments.length) {
              setShowComments(prev => prev + 10)
            } else {
            // si ya mostro el array completo pide 100 mas
            loadMoreComments()
            }
          }}
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        > Mas comentarios </button> 
        : ""
      }
    </div>
  );
};

export default CommentsContainer;
