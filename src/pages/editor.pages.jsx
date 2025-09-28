import { useEffect, useState } from 'react'
import BlogEditor from '../components/blog/blog-editor.component'
import PublishForm from '../components/publish-form.component'
import { useBlog } from '../context/BlogContext'
import { useParams } from 'react-router-dom'
import Loader from '../components/ui/Loader'

const Editor = () => {

  const { getPostByIdSlug } = useBlog()
  let {slug} = useParams()
  const { editorState } = useBlog()

  const [loading, setLoading] = useState(true)
  const [postBySlug, setPostBySlug] = useState([])

  useEffect(() => {
    if(!slug) {
      return setLoading(false)
    }

    try {
      const getPost = async () => {
        const result = await getPostByIdSlug(slug)
        setPostBySlug(result)
        setLoading(false)
      }
      getPost()
    } catch (error) {
      console.log(error)
    }
  }, [])

  return ( 
    loading ? <Loader /> :
    editorState === 'editor' ? <BlogEditor postBySlug={postBySlug} setPostBySlug={setPostBySlug}/> : <PublishForm postBySlug={postBySlug} setPostBySlug={setPostBySlug}/>
  )
}

export default Editor