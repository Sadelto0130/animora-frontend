import React, { useState } from "react";
import { getDay } from "../../libs/utils";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import CommentsField from "./CommentsField";

const CommentCard = ({ index, leftVal, comment }) => {
  const {user} = useAuth()
  const {
    comment_id,
    content,
    created_at,
    post_id,
    replies = [],
    users: { avatar_url, name, last_name, user_name },
  } = comment;
  const [isReply, setIsReply] = useState(false)

  const handleReplyClick = () => {
    if(!user)
      return toast.error("Debe iniciar sesion para responder")

    setIsReply(preVal => !preVal)
  }

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img
            src={avatar_url?.replace(/;/g, "")}
            className="w-6 h-6 rounded-full"
          />

          <p className="line-clamp-1">
            {name} {last_name} @{user_name}
          </p>

          <p className="min-w-fit">{getDay(created_at)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{content}</p>

        <div className="flex gap-5 items-center mt-5">
          <button className="underline" onClick={handleReplyClick}>Responder</button>
        </div>

        {
          isReply ?
          <div className="mt-8">
            <CommentsField action="responder" parentId={comment_id} index={index} setIsReply={setIsReply}/>
          </div> : ""
        }
        {replies.length > 0 &&
        replies.map((reply) => (
          <CommentCard key={reply.comment_id} comment={reply} />
        ))}
      </div>
    </div>
  );
};

export default CommentCard;
