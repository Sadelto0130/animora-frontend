import React from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../libs/utils.js'

const MinimalBlogPost = ({ post, index}) => {

  let { title, post_id, created_at, slug } = post
  let { avatar_url, name, last_name, user_name } = post.users || {}
  
  return (
    <Link to={`/post/${slug}`} className='flex gap-5 mb-8'>
      <h1 className='blog-index text-[#b6b6b6b6]'>{index < 10 ? "0" +(index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={avatar_url !== null ? avatar_url.replace(/;/g, "") : ""} alt="" className="w-6 h-6 rounded-full" />
          <p className='line-clamp-1'>{name} {last_name} @{user_name}</p>
          <p className="min-w-fit">{getDay(created_at)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  )
}

export default MinimalBlogPost