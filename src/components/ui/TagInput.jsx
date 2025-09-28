import React, { useState, useEffect } from "react";
import { useBlog } from "../../context/BlogContext";
import toast from "react-hot-toast";

const TagInput = ({ tagLimit = 10, prevTags }) => {
  const {
    posts,
    setPosts,
    getCountAllTags,
  } = useBlog();

  const postTags = posts?.tags || prevTags || [];
  const [query, setQuery] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  useEffect(() => {

    if(posts.tags && posts.tags.length > 0) {
      setPosts(prev => ({...prev, tags: posts.tags}))
      return
    }

    if(prevTags && prevTags.length > 0) {
      setPosts(prev => ({...prev, tags: prevTags}))
      return
    }
  }, [prevTags || posts]) 

  useEffect(() => {
    const obtenerTags = async () => {
      try {
        const tags = await getCountAllTags();
        const tagNames = tags.map((t) => t.tag.toLowerCase());
        setAllTags(tagNames);
      } catch (error) {
        console.error("Error al obtener tags:", error);
      }
    };
    obtenerTags();
  }, []);

  const handleSelect = (tag) => {
    if (postTags.length >= tagLimit) {
      return toast.error(`Solo puede agregar ${tagLimit} tags`);
    }
    if (!postTags.includes(tag)) {
      setPosts({ ...posts, tags: [...postTags, tag] });
    }
    setQuery("");
    setFilteredTags([]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setFilteredTags([]);
      return;
    }

    const filtered = allTags
      .filter((t) => t.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10);

    setFilteredTags(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (query.trim() !== "") {
        handleSelect(query.trim().toLowerCase());
      }
    }
  };

  const handleTagEdit = (e, tagIndex) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      let currentTag = e.target.innerText.trim().toLowerCase();

      // borra el tag vacío
      if (!currentTag) {
        const newTags = postTags.filter((_, idx) => idx !== tagIndex);
        return setPosts({ ...posts, postTags: newTags });
      }

      // Verifica duplicados
      const isDuplicate = postTags.some(
        (t, idx) => idx !== tagIndex && t.toLowerCase() === currentTag
      );

      if (isDuplicate) {
        return toast.error("Ese tag ya existe");
      }

      // Actualiza el tag editado
      const newTags = [...postTags];
      newTags[tagIndex] = currentTag;
      setPosts({ ...posts, postTags: newTags });
    }
  };

  return (
    <>
      <p className="text-dark-grey mb-2 mt-9">
        Tags - (Ayuda a encontrar tu posts en los filtros)
      </p>
      <div className="relative w-full input-box pl-2 py-2 pb-4">
        <input
          type="text"
          placeholder="Tags"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white placeholder:text-dark-grey"
        />

        {/* Dropdown de sugerencias */}
        {query && (
          <ul className="absolute left-0 right-0 z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto shadow-md">
            {filteredTags?.map((tag, i) => (
              <li
                key={i}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(tag)}
              >
                {tag}
              </li>
            ))}

            {/* Crear nuevo tag */}
            {!allTags?.includes(query.toLowerCase()) && (
              <li
                className="p-2 text-blue-600 hover:bg-blue-100 cursor-pointer font-medium"
                onClick={() => handleSelect(query.toLowerCase())}
              >
                ➕ Crear nuevo tag: <b>{query}</b>
              </li>
            )}
          </ul>
        )}

        {/* Tags seleccionados */}
        <div className="flex flex-wrap gap-2 mt-2">
          {postTags?.map((tag, i) => (
            <div
              key={i}
              className="relative p-2 px-5 bg-white rounded-full inline-flex items-center gap-2 hover:bg-opacity-50"
            >
              <p
                className="outline-none"
                contentEditable
                suppressContentEditableWarning={true}
                onKeyDown={(e) => handleTagEdit(e, i)} 
              >
                {tag}
              </p>
              <button
                onClick={() =>
                  setPosts({
                    ...posts,
                    tags: postTags?.filter((_, idx) => idx !== i),
                  })
                }
              >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
              </button>
            </div>
          ))}
        </div>

        <p className="mt-1 text-dark-grey text-sm text-right">
          Quedan {tagLimit - postTags?.length} tags disponibles
        </p>
      </div>
    </>
  );
};

export default TagInput;
