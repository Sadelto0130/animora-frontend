import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const BlogInteraction = ({post}) => {

  const { user } = useAuth()

  const {total_likes, comments, title, users, slug} = post || {}

  return (
    <>
      <hr className="border-[#dfdfdf] my-2" />

      <div className="flex gap-6 justify-between"> 
        <div className="flex gap-3 items-center">

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dfdfdf]" >
            <i className="fi fi-rr-heart"></i>
          </button>
          <p>{total_likes ? total_likes : 0}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dfdfdf]" >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p>{comments[0].comentarios === null ? (comments?.length - 1) : comments?.length}</p>

        </div>

        <div className="flex gap-6 items-center">

          {
            user === null ? "" :
            user.id === users?.id ? 
              <Link 
                to={`/editor/${slug}`}
                className='underline hover:text-purple'
              >
                Editar 
              </Link>
            : ""
          }
          <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>

      </div>
      <hr className="border-[#dfdfdf] my-2" />
    </>
  )
}

export default BlogInteraction