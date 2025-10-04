 import client from "./axios"; 

export const createPost = (post) => client.post("/post", post);

export const getPosts = (limit = 10, offset = 0) =>
  client.get("/posts", { params: { limit, offset } });

export const getTrendingPosts = () => client.get("/trending_blogs");

export const getCountTags = () => client.get("/counter_tags");

export const getPostByTag = (tag) => 
  client.get("/posts_tag", { params: { tag } });

export const getSearchPosts = (search, limit, offset) =>
  client.get("/search_posts", { params: { search, limit, offset } });

export const getSearchUSers = (search, limit, offset) =>
  client.get("/search_users", {params: {search, limit, offset}})

export const getPostByIdUser = (id_user, limit, offset) => 
  client.get(`/post_user/${id_user}`, {params: {limit, offset}});

export const getPostById = (post_slug) => client.get(`/post/${post_slug}`);

export const updatePostReadCount = (post_id, user_id, user_uuid) =>
  client.post("/read_count", { post_id, user_id, user_uuid });

export const updatePost = (id, postUpdate) => client.put(`/post/${id}`, postUpdate);

export const likePost = (post_id, user_id) => client.post(`/like_post`, {post_id, user_id}) 

export const disLikePost = (post_id, user_id) => client.delete(`/dislike_post`, {data: {post_id, user_id}}) 

/* rutas sin usar */


export const deletePost = (id) => client.put(`/post_deleted/${id}`);
