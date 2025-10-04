import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast'
import { useBlog } from '../../context/BlogContext'

const CommentsField = ({ action, idPost, index = undefined, parentId = undefined, setIsReply }) => {
  const {countComments, setCountComments } = useBlog()
  const {user} = useAuth()
  const {createComments, posts} = useBlog()
  const [text, setText] = useState("")
  const [sendComment, setSendComment] = useState({})
  
  let characterLimit = 500

  const handleComment = async () => {
    if (!user) {
      return toast.error("Debe iniciar sesion para comentar")
    }

    if(text.trim() === "") return toast.error("Debe escribir un comentario")

    if(text.length <= 4) return toast.error("El comentario debe tener mas de 4 caracteres")
    
    if(text.length >= 500) return toast.error("El comentario No debe tener mas de 500 caracteres")

    const commentData = {
    id_user: user.id,
    id_post: idPost,
    content: text,
    parent_comment_id: parentId || null
  };

    try {
      const resp = await createComments(commentData)
      toast.success(resp.message)
      setCountComments(prev =>  prev + 1)
      setText("")
      if(parentId) setIsReply(preVal => !preVal)
    } catch (error) {
      const respError = error.response
      if (error.response) {
        console.log("Error:", respError.data );
        return toast.error(respError.data.error)         
      } 
      if (error.request) {
        // La request se hizo pero no hubo respuesta
        console.log("No hubo respuesta:", error.request);
        return
      } else {
        // Otro error
        console.log("Error:", error);   
        return 
        }
    } 
  }
  
  useEffect(()=> {
    setSendComment({
      id_user: user?.id,
      id_post: idPost,
      content: text,
      parent_comment_id: null
    })
  }, [idPost])
  
  useEffect(()=> {
    setSendComment(prevComment => ({
      ...prevComment,
      content: text
    }))
  }, [text])

  return (
    <>
      <Toaster />
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder='Deja un comentario...'
        className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
      ></textarea>
      <p className="mt-1 text-dark-grey text-sm text-right">
            Quedan {characterLimit - text?.length} caracteres disponibles
          </p>
      <button 
        onClick={()=> handleComment()}
        className="btn-dark mt-5 px-10">{action}</button>
    </>
  )
}

export default CommentsField