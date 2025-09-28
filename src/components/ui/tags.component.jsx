import React from "react";
import { useBlog } from "../../context/BlogContext";
import toast from "react-hot-toast";

const Tag = ({ tag, tagIndex }) => {
  let {
    posts,
    posts: { tags },
    setPosts,
  } = useBlog();

  const handleTagDelete = () => {
    tags = tags.filter((t) => t !== tag);
    setPosts({ ...posts, tags });
  };

  const handleTagEdit = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      let currentTag = e.target.innerText.trim().toLowerCase();

      // borra el tag vacio
      if (!currentTag) {
        const newTags = tags.filter((_, idx) => idx !== tagIndex);
        return setPosts({ ...posts, tags: newTags });
      }

      // Verifica duplicados
      const isDuplicate = tags.some(
        (t, idx) => idx !== tagIndex && t.toLowerCase() === currentTag
      );

      if (isDuplicate) {
        return toast.error("Ese tag ya existe");
      }

      // Actualiza el tag editado
      const newTags = [...tags];
      newTags[tagIndex] = currentTag;
      setPosts({ ...posts, tags: newTags });
    }
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={handleTagEdit}
      >
        {tag} 
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
