import React, { useEffect, useState } from "react";
import { getDay } from "../../libs/utils.js";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext.jsx";

const BlogPostCard = ({ contenido, autor }) => {

  let {
    created_at,
    title,
    tags,
    content,
    liked_by,
    total_likes,
    banner,
    slug
  } = contenido;
  let { name, last_name, avatar_url, user_name } = autor;

  let fullName = `${name} ${last_name}`;

  return (
    <Link to={`/post/${slug}`} className="flex gap-8 items-center border-b border-[#a0a0a0] pb-5 mb-4">
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={avatar_url !== null ? avatar_url.replace(/;/g, "") : ""} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullName} @{user_name}
          </p>
          <p className="min-w-fit">{getDay(created_at)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[110px]:hidden line-clamp-2">
          {content.length > 1
            ? content[0].data.text
            : "No hay contenido para mostrar"}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey">
        <img src={banner} className="w-full h-full aspect-square object-cover" />        
      </div>
    </Link>
  );
};

export default BlogPostCard;
