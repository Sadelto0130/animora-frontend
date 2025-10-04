import client from "./axios";

export const createNewComments = (comments) => client.post("/comments", comments);

export const getComments = (post_id, offset, limit) => client.get(`/comments/${post_id}`, {params: {offset, limit}});
