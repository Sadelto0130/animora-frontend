import { uploadImage } from "../../common/aws.jsx";
import AnimationWrapper from "../../common/page-animation.jsx";
import defaultBanner from "../../imgs/blog banner.png";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { editorI18nEs, tools } from "../../libs/editorConfig.js";
import { useBlog } from "../../context/BlogContext.jsx";
import { set } from "zod";
import Loader from "../ui/Loader.jsx";

const BlogEditor = ({ postBySlug, setPostBySlug }) => {
  let blogBannerRef = useRef();
  const { posts, setPosts, setEditorState } = useBlog();
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postBySlug) {
      setPosts(postBySlug);
    }
  }, [postBySlug]);

  useEffect(() => {
    if(loading) return
    const initEditor = async () => {
      if (!editorRef.current) {
        const blocks = [...(postBySlug?.content || posts?.content || [])];

        editorRef.current = new EditorJS({
          holder: "textEditor",
          data: { blocks },
          tools,
          placeholder: "Escribe tu post aqui...",
          i18n: editorI18nEs,
        });
      }
    };

    initEditor();

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [postBySlug, loading]);

  useEffect(()=> {setLoading(false)}, [])

  // Ajusta la altura automáticamente cuando cambia el valor
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset
      textarea.style.height = `${textarea.scrollHeight}px`; // ajustar al contenido
    }
  }, [posts.title]);

  const handleBannerUpload = async (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Subiendo imagen...");
      try {
        const imgURL = await uploadImage(img);
        setPosts({ ...posts, banner: imgURL });
        if (imgURL) {
          toast.dismiss(loadingToast);
          toast.success("Imagen cargada exitosamente");
          blogBannerRef.current.src = imgURL;
        }
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        toast.dismiss(loadingToast);
        toast.error("Error subiendo imagen");
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    //Evita el uso del enter
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    setPosts((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handlePublish = async () => {
    if (!posts.banner) return toast.error("Debe agregar una imagen al banner");

    if (!posts.title) return toast.error("Debe agregar un titulo");

    try {
      const output = await editorRef.current.save();

      if (output.blocks.length === 0)
        return toast.error("Debe agregar contenido al post");

      const textos = output.blocks
        .filter((p) => p.type === "paragraph")
        .map((p) => p.data.text);

      const textoCompleto = textos.join(" "); // une todos los textos
      const cantidadPalabras = textoCompleto
        .trim() // quita espacio inicio y final
        .split(/\s+/).length; // separa por cualquier espacio

      if (parseInt(cantidadPalabras) < 200) {
        return toast.error("El texto debe tener mas de 200 palabras");
      }

      setPosts((prev) => ({
        ...prev,
        content: output.blocks,
      }));

      setPostBySlug({
        ...posts,
        content: output.blocks,
      });

      setEditorState("publish");
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
    }
  };

  if (loading) return <Loader />;
  return (
    <>
      <Toaster />
      <section>
        <div className="mx-auto max-w-[900px] w-full">
          <AnimationWrapper>
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  ref={blogBannerRef}
                  src={posts.banner ? posts.banner : defaultBanner}
                  className="z-20"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              ref={textareaRef}
              value={posts.title ? posts.title : ""}
              placeholder="Titulo"
              className="text-4xl font-medium w-full min-h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 overflow-hidden"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </AnimationWrapper>
        </div>
      </section>
      <div className="flex justify-center gap-4 ml-auto pb-10">
        <button className="btn-dark py-2" onClick={handlePublish}>
          {postBySlug.length > 0 ? "Actualizar" : "Publicar"}
        </button>
        <button className={postBySlug.length > 0 ? "hidden" : `btn-light py-2`}>
          Guardar
        </button>
      </div>
    </>
  );
};

export default BlogEditor;
