import React, { useEffect, useState } from "react";
import { useBlog } from "../../context/BlogContext";
import CommentsField from "./CommentsField";
import NoDataMessage from "../ui/nodata.component";
import { useSocket } from "../../context/SocketContext";
import AnimationWrapper from "../../common/page-animation";
import CommentCard from "./CommentCard";

const CommentsContainer = () => {
  const {
    comentarios,
    setComentarios,
    getCommentsPost,
    allComments,
    setAllComments,
    setCountComments,
    countComments,
    posts: { title, post_id, user_id },
  } = useBlog();
  const socket = useSocket();
  const [showComments, setShowComments] = useState(10);
  const [offset, setOffset] = useState(0);
  const limit = 100;

  const loadMoreComments = async () => {
    const moreComments = await getCommentsPost(post_id, limit, offset);
    if (moreComments?.length) {
      setAllComments((prev) => [...prev, ...moreComments]);
      setOffset((prev) => prev + limit);
    }
  };

  useEffect(() => {
    if (!post_id) return;
    const getAllComments = async () => {
      const commentsData = await getCommentsPost(post_id);
      setAllComments(commentsData?.content || []);
    };
    getAllComments();
  }, [post_id]);

  // Socket para comentarios en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (newComment) => {
      if (newComment?.post_id !== post_id || !newComment.content?.trim())
        return;

      setAllComments((prev) => {
        if (prev.some((c) => c.comment_id === newComment.comment_id))
          return prev;

        if (newComment.parent_comment_id) {
          const insertRecursively = (comments) => {
            return comments.map((c) => {
              if (c.comment_id === newComment.parent_comment_id) {
                return { ...c, replies: [...(c.replies || []), newComment] };
              }
              if (c.replies?.length)
                return { ...c, replies: insertRecursively(c.replies) };
              return c;
            });
          };
          return insertRecursively(prev);
        }

        return [newComment, ...prev];
      });
    };
    setCountComments(allComments.length);

    socket.on("update-comments", handleNewComment);
    return () => socket.off("update-comments", handleNewComment);
  }, []);

  // Socket para eliminar en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleDeleteComment = ({ deletedIds }) => {
      const filterRecursively = (comments) => {
        return comments
          .filter((c) => !deletedIds.includes(c.comment_id))
          .map((c) => ({
            ...c,
            replies: c.replies ? filterRecursively(c.replies) : [],
          }));
      };
      setAllComments((prev) => filterRecursively(prev));
    };

    socket.on("delete-comment", handleDeleteComment);
    return () => socket.off("delete-comment", handleDeleteComment);
  }, [socket]);

  useEffect(() => {
    if (socket && post_id) socket?.emit("join-post", post_id);
    return () => socket?.emit("leave-post", post_id);
  }, [socket, post_id]);

  useEffect(() => {
    setCountComments(allComments?.length || 0);
  }, [allComments]);

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (comentarios ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comentarios</h1>
        <p className="text-lg mt-2 w-[70%] text-dak-grey line-clamp-1">
          {title}
        </p>
        <button
          onClick={() => setComentarios((preVal) => !preVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>
      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentsField
        action="comentar"
        idPost={post_id}
        onNewReply={(newComment) =>
          setAllComments((prev) => [newComment, ...prev])
        }
      />

      {allComments?.length ? (
        allComments.slice(0, showComments).map((comment, i) => (
          <AnimationWrapper key={comment.comment_id ?? `comment-${i}`}>
            <CommentCard
              comment={comment}
              leftVal={comment.level * 4}
              blogAutor={user_id}
            />
          </AnimationWrapper>
        ))
      ) : (
        <NoDataMessage message="Sin comentarios aun" />
      )}

      {allComments?.length > showComments && (
        <button
          onClick={() =>
            showComments + 10 <= allComments.length
              ? setShowComments((prev) => prev + 10)
              : loadMoreComments()
          }
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >
          Mas comentarios
        </button>
      )}
    </div>
  );
};

export default CommentsContainer;
