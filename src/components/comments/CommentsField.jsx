import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import toast, { Toaster } from "react-hot-toast";

const CommentsField = ({ action, idPost, parentId, setIsReply, onNewReply }) => {
  const { user } = useAuth();
  const { countComments, setCountComments, setAllComments, createComments } = useBlog();
  const [text, setText] = useState("");
  const characterLimit = 500;

  const handleComment = async () => {
    if (!user) return toast.error("Debe iniciar sesión para comentar");
    if (text.trim().length < 5) return toast.error("El comentario debe tener más de 4 caracteres");
    if (text.length > characterLimit) return toast.error("El comentario no debe superar 500 caracteres");

    const commentData = {
      id_user: user.id,
      id_post: idPost,
      content: text,
      parent_comment_id: parentId || null,
    };

    try {
      const resp = await createComments(commentData);
      const newComment = resp.data;

      toast.success("Comentario enviado");
      setText("");
      if (setIsReply) setIsReply(false);
      setCountComments(prev => prev + 1);

      // Actualizar comentarios globales
      const insertReplyRecursively  = (comments, parentId, reply) => {
        return comments.map(c => {
          if (c.comment_id === parentId) {
            return { ...c, replies: [...(c.replies || []), reply] };
          }
          if (c.replies?.length) {
            return { ...c, replies: insertReplyRecursively (c.replies, parentId, reply) };
          }
          return c;
        });
      };

      setAllComments(prev => {
        if (parentId) return insertReplyRecursively(prev, parentId, newComment);
        return [newComment, ...prev];
      });

      /* if (parentId) {
        setAllComments(prev => insertReply(prev, parentId, newComment));
      } else {
        setAllComments(prev => [newComment, ...prev]);
      } */

      // Actualizar comentarios locales en CommentCard
      if (onNewReply) onNewReply(newComment, parentId);

    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || "Error al enviar comentario";
      toast.error(msg);
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Deja un comentario..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      />
      <p className="mt-1 text-dark-grey text-sm text-right">
        Quedan {characterLimit - text.length} caracteres disponibles
      </p>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentsField;
