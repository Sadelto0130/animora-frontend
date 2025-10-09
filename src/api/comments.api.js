import client from "./axios";

export const createNewComments = (comments) => client.post("/comments", comments);

export const getComments = (post_id, offset, limit) => client.get(`/comments/${post_id}`, {params: {offset, limit}});

export const deleteComments = (comment_id, user_id) => client.put(`/comments_delete/${comment_id}`, {params: {user_id}})
 