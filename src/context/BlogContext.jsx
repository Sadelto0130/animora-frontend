import { createContext, useContext, useState } from "react";
import {
  createPost,
  getPosts,
  getPostById,
  getPostByIdUser,
  updatePost,
  deletePost,
  getTrendingPosts,
  getCountTags,
  getPostByTag,
  getSearchPosts,
  getSearchUSers,
  updatePostReadCount,
  likePost,
  disLikePost,
} from "../api/blog.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrCreateUUID } from "../libs/utils";
import { createNewComments, getComments } from "../api/comments.api";

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog debe estar dentro de BlogProvider");
  return context;
};

export const BlogProvider = ({ children }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState({
    title: "",
    banner: "",
    content: [],
    descripcion: "",
    country: "",
    state: "",
    city: "",
    slug: "",
    postTags: [],
    draft: false,
  });
  const [allPosts, setAllPosts] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [editorState, setEditorState] = useState("editor");
  const [comentarios, setComentarios] = useState(false);
  const [countComments, setCountComments] = useState(0);
  const [allComments, setAllComments] = useState([])

  const createBlogPost = async (post) => {
    try {
      const payload = {
        title: post.title,
        banner: post.banner || null,
        content: post.content,
        descripcion: post.descripcion || null,
        country: post.country || null,
        state: post.state || null,
        city: post.city || null,
        slug: post.slug || null,
        draft: post.draft,
      };

      const rest = await createPost(payload);

      setPosts((prev) => ({
        ...prev,
        ...payload,
        data: rest.data,
        postTags: rest?.data.postTags || [],
      }));

      toast.success("Post Creado con Éxito");
      setTimeout(() => {
        navigate("/");
      }, 2000);

      return rest.data;
    } catch (error) {
      console.error(
        "Error al crear el posts:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error al crear el post");
    }
  };

  const getAllPosts = async (limit = 10, offset = 0) => {
    try {
      const { data } = await getPosts(limit, offset);
      const filterPosts = data.filter(
        (post) => !(post.is_active === false || post.draft === true)
      );

      if (offset === 0) {
        // Primera carga de datos (resetea)
        setAllPosts(filterPosts);
      } else {
        // Cargar más datos (concatena)
        setAllPosts((prev) => [...prev, ...filterPosts]);
      }

      return filterPosts;
    } catch (error) {
      console.error(
        "Error al obtener los posts:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error al obtener los post");
    }
  };

  const getPostsTrending = async () => {
    try {
      const trending = await getTrendingPosts();

      return trending.data;
    } catch (error) {
      console.error(
        "Error al obtener los posts:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error al obtener los post");
    }
  };

  const getCountAllTags = async () => {
    try {
      const countTags = await getCountTags();

      return countTags.data;
    } catch (error) {
      console.error(
        "Error al obtener los tags:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error al obtener los tags");
    }
  };

  const getAllPostByTag = async (tag) => {
    try {
      const result = await getPostByTag(tag);
      if (!result.data || result.data.length === 0) {
        toast.error("No se encontraron posts para este tag");
        return [];
      }
      return result?.data;
    } catch (error) {
      console.error(
        "Error al obtener los posts por tag:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Error al obtener los post por tag"
      );
    }
  };

  const getPostBySearch = async (limit = 10, offset = 0, search) => {
    try {
      const { data } = await getSearchPosts(`%${search}%`, limit, offset);

      if (!data || data.length === 0) {
        toast.error("No se encontraron posts para esta búsqueda");
        return [];
      }

      const filterPosts = data.filter(
        (post) => !(post.is_active === false || post.draft === true)
      );

      return filterPosts;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error al obtener los post por búsqueda"
      );
    }
  };

  const getUsersBySearch = async (limit = 20, offset = 0, search) => {
    try {
      const { data } = await getSearchUSers(`%${search}%`, limit, offset);

      if (!data || data.length === 0) {
        toast.error("No se encontraron usuarios para esta búsqueda");
        return [];
      }

      const filterUsers = data.filter((user) => user.is_active === true);

      return filterUsers;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error al obtener los usuarios por búsqueda"
      );
    }
  };

  const getUserPost = async (id_user, limit = 10, offset = 0) => {
    try {
      const { data } = await getPostByIdUser(id_user, limit, offset);
      if (!data || data.length === 0) {
        toast.error("No se encontraron posts para este usuario");
        return [];
      }

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error al obtener los posts del usuario"
      );
    }
  };

  const getPostByIdSlug = async (post_slug) => {
    try {
      const { data } = await getPostById(post_slug);
      if (!data || data.length === 0) {
        toast.error("No se encontraron posts para este usuario");
        return [];
      }

      if (!data.is_active) {
        toast.error("El post no está disponible");
        return [];
      }

      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al obtener el post");
    }
  };

  const updateReadCount = async (post_id, user_id) => {
    const user_uuid = user_id ? null : getOrCreateUUID();
    const id_user = user_id || null;
    try {
      await updatePostReadCount(post_id, id_user, user_uuid);
    } catch (error) {
      console.error(
        "Error al actualizar el contador de lecturas:",
        error.response?.data || error.message
      );
    }
  };

  const updatePostById = async (postUpdate) => {
    try {
      const { data } = await updatePost(postUpdate.post_id, postUpdate);

      return data.message;
    } catch (error) {
      console.error(
        "Error al actualizar el contador de lecturas:",
        error.response?.data || error.message
      );
    }
  };

  const likePostUser = async (post_id, user_id) => {
    try {
      const { data } = await likePost(post_id, user_id);
      return data;
    } catch (error) {
      console.error(
        "Error al agregar like",
        error.response?.data || error.message
      );
    }
  };

  const desLikePostUser = async (post_id, user_id) => {
    try {
      const { data } = await disLikePost(post_id, user_id);
      return data;
    } catch (error) {
      console.error(
        "Error al quitar like",
        error.response?.data || error.message
      );
    }
  };

  const createComments = async (comments) => {
    if (!comments.id_post) return console.error("Error idPost");
    if (comments.content === "") return console.error("Debe escribir un comentario");
    try {
      const resp = await createNewComments(comments);
      return resp;
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "Error al crear comentario"
      );
    }
  };

  const getCommentsPost = async (post_id, limit = 100, offset = 0) => {
    try {
      const { data } = await getComments(post_id, offset, limit);
      if (!data || data.length === 0) {
        toast.error("No se encontraron comentarios para este post");
        return [];
      }
      return data;
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "Error al obtener los comentarios"
      );
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        setPosts,
        isReady,
        setIsReady,
        comentarios,
        setComentarios,
        allComments, 
        setAllComments,
        countComments,
        setCountComments,
        editorState,
        allPosts,
        setEditorState,
        createBlogPost,
        getAllPosts,
        getPostsTrending,
        getCountAllTags,
        getAllPostByTag,
        getPostBySearch,
        getUsersBySearch,
        getUserPost,
        getPostByIdSlug,
        getCommentsPost,
        updateReadCount,
        updatePostById,
        likePostUser,
        desLikePostUser,
        createComments,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
