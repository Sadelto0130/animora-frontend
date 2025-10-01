import React, { useEffect, useState } from "react";
import { useBlog } from "../../context/BlogContext.jsx";
import AnimationWrapper from "../../common/page-animation.jsx";
import toast, { Toaster } from "react-hot-toast";
import LocationSelector from "../ui/CountrySelector.jsx";
import { slugify } from "../../libs/slugify.js";
import TagInput from "../ui/TagInput.jsx";
import { useNavigate } from "react-router-dom";

const PublishForm = ({ postBySlug, setPostBySlug }) => {
  const navigate = useNavigate();
  const {
    posts,
    setPosts,
    posts: { banner, title, slug, image_url, draft, tags, description },
    setEditorState,
    createBlogPost,
    updatePostById
  } = useBlog();

  const [isPublishing, setIsPublishing] = useState(false);
  const [draftPost, setDraftPost] = useState(false);
  let characterLimit = 200;

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handlePostTitle = (e) => {
    let input = e.target;
    setPosts({ ...posts, title: input.value });
  };

  const handleDescription = (e) => {
    let input = e.target;
    setPosts({ ...posts, description: input.value });
  };

  const handleTitleKeyDown = (e) => {
    //Evita el uso del enter
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handlePostPublish = async (isDraft = false) => {
    if (isPublishing) return;

    if (!title?.length)
      return toast.error("Escribe un titulo antes de publicar");

    if (!description?.length || description?.length > characterLimit) {
      return toast.error(
        `Escribe una descripcion sobre la publicacion de ${characterLimit} caracteres`
      );
    }

    if (!tags?.length)
      return toast.error("Agrega al menos un tag para clasificar el post");

    if (!posts.state) return toast.error("Debe agregar una ubicación");

    setIsPublishing(true);

    const generateSlug = slugify(posts.title);

    try {
      const newPost = {
        ...posts,
        slug: generateSlug,
        draft: isDraft ? isDraft : draftPost,
      };

      setPosts(newPost);

      const created = await createBlogPost(newPost);
      toast.success("Post creado con exito"); 
      setTimeout(() => {
        navigate(`/user_profile/${updatePost.users.user_name}`);
      }, 2000); // espera 2 segundos 
    } catch (error) {
      toast.error("Error al crear el post");
      console.error("Error al crear el posts:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePostUpdate = async (isDraft = false) => {
    if (isPublishing) return;

    if (!title?.length)
      return toast.error("Escribe un titulo antes de publicar");

    if (!description?.length || description?.length > characterLimit) {
      return toast.error(
        `Escribe una descripcion sobre la publicacion de ${characterLimit} caracteres`
      );
    }

    if (!tags?.length)
      return toast.error("Agrega al menos un tag para clasificar el post");

    if (!posts.state) return toast.error("Debe agregar una ubicación");

    try {
      const updatePost = {
        ...posts,
        draft: isDraft ? isDraft : draftPost,
      };

      setPosts(updatePost);

      const res = await updatePostById(updatePost)
      toast.success("Post actualizado con exito"); 
      setTimeout(() => {
        navigate(`/user_profile/${updatePost.users.user_name}`);
      }, 2000); // espera 2 segundos
    } catch (error) {
      toast.error("Error al crear el post");
      console.error("Error al crear el posts:", error);
    } finally {
      setIsPublishing(false);
    } 
  };

  useEffect(() => {
    posts
  }, [draftPost])

  return (
    <AnimationWrapper>
      <section className="w-screen grid items-start lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] top-[5%] lg:top-[10%] lg:pt-10 pt-20"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-auto center">
          <p className="text-dark-grey mb-1">Revision</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {description}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Titulo del Post</p>
          <input
            type="text"
            placeholder="Titulo del Post"
            defaultValue={posts.title}
            className="input-box pl-4"
            onChange={handlePostTitle}
          />

          <p className="text-dark-grey mb-2 mt-9">Descripcion Corta del Post</p>
          <textarea
            maxLength={characterLimit}
            defaultValue={description}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleDescription}
            onKeyDown={handleTitleKeyDown}
          ></textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">
            Quedan {characterLimit - description?.length} caracteres disponibles
          </p>

          <TagInput prevTags={tags} />

          <LocationSelector
            countryPost={postBySlug.country}
            statePost={postBySlug.state}
            cityPost={postBySlug.city}
          />

          <div className="flex justify-center">

            <button
              className={`btn-dark mr-8 py-2 ${
                isPublishing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPublishing}
              onClick={() =>{
                setDraftPost()
                postBySlug.post_id > 0 ? handlePostUpdate() : handlePostPublish()
              }}
            >
              {postBySlug
                ? (isPublishing ? "Actualizando..." : "Actualizar")
                : (isPublishing ? "Publicando..." : "Publicar")}
            </button>

            <button
              className={`btn-gray ml-4 py-2 px-4 border border-dark-grey rounded-full hover:bg-dark-grey hover:text-grey ${
                isPublishing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPublishing}
              onClick={() => {               
                postBySlug.post_id > 0 ? handlePostUpdate(true) : handlePostPublish(true)
              }}
            >
              {isPublishing ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
