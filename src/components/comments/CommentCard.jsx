import React, { useState, useEffect } from "react";
import { getDay } from "../../libs/utils";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import CommentsField from "./CommentsField";
import { useBlog } from "../../context/BlogContext";
import { useSocket } from "../../context/SocketContext";

const CommentCard = ({ comment, leftVal = 0, onNewReply, blogAutor }) => {
  const socket = useSocket()
  const { user } = useAuth();
  const { deleteCommentsPost } = useBlog()
  const {comment_id, content, parent_comment_id, created_at, post_id, user_id, users, replies = [] } = comment;

  const [isReply, setIsReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [localReplies, setLocalReplies] = useState(replies || []);

  // Mantener localReplies sincronizado con prop
  useEffect(() => {
  if (JSON.stringify(replies) !== JSON.stringify(localReplies)) {
    setLocalReplies(replies || []);
  }
}, [replies]);


  const handleToggleReplies = () => setShowReplies(prev => !prev);
  const handleReplyClick = () => {
    if (!user) return toast.error("Debe iniciar sesión para responder");
    setIsReply(prev => !prev);
  };

  // Inserta un reply recursivamente en cualquier nivel
  const handleNewReply = (newReply, parentId) => {
    const insertRecursively = (comments) => {
      return comments.map(c => {
        if (c.comment_id === parentId) {
          return { ...c, replies: [newReply, ...(c.replies || [])] };
        }
        if (c.replies?.length) {
          return { ...c, replies: insertRecursively(c.replies) };
        }
        return c;
      });
    };

    setLocalReplies(prev => insertRecursively(prev));

    if (onNewReply) onNewReply(newReply, parentId); // Propaga hacia CommentsContainer
  };

  const handleDeleteComments = async () => {
    await deleteCommentsPost(comment_id, user.id)
    toast.success("Comentario eliminado")  
  }

  if (!comment_id || !content?.trim() || !created_at || !users?.name || !users?.user_name) return null;

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-3">
          <img src={users?.avatar_url} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">{users?.name} {users?.last_name} @{users?.user_name}</p>
          <p className="min-w-fit">{getDay(created_at)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{content}</p>

        <div className="flex gap-5 items-center mt-5">
          {localReplies.length > 0 && (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/20 rounded-md flex items-center gap-2"
              onClick={handleToggleReplies}
            >
              {showReplies ? "Ocultar respuestas" : <> <i className="fi fi-rr-comment-dots"></i> {localReplies.length} respuestas</>}
            </button>
          )}
          <button className="underline" onClick={handleReplyClick}>Responder</button>

          {
            !user ? "" : 
              user_id === user?.id || user?.id === blogAutor
                ? <button onClick={handleDeleteComments} className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center">
                    <i className="fi fi-rr-trash pointer-events-none"></i>
                  </button>  
                : ""
          }
          
        </div>

        {isReply && (
          <div className="mt-4">
            <CommentsField
              action="responder"
              idPost={post_id}
              parentId={comment_id}
              setIsReply={setIsReply}
              onNewReply={handleNewReply}
            />
          </div>
        )}

        {showReplies && localReplies.length > 0 &&
          [...localReplies].reverse().map((reply) => (
            <CommentCard
              key={reply.comment_id ?? `reply-${reply.comment_id}-${Date.now()}`}
              comment={reply}
              leftVal={leftVal + 1}
              onNewReply={handleNewReply} // recursivo
              blogAutor={blogAutor}
            />
          ))
        }
      </div>
    </div>
  );
};

export default CommentCard;
