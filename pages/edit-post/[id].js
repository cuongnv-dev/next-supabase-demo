import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import "easymde/dist/easymde.min.css"
import dynamic from 'next/dynamic'
import { supabase } from '../../api'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'),{ssr:false})

const EditPost = () => {
  const [post, setPost] = useState([])
  const router = useRouter()
  const {id} = router.query

  useEffect(() => {
    fetchPosts()
    async function fetchPosts(){
      if(!id) return
      const {data} = await supabase
        .from('posts')
        .select()
        .filter('id', 'eq', id)
        .single()
      setPost(data)
    }
  },[id])
  if(!post) return null

  const handleOnChange = (e) =>{
    setPost(() => ({...post, [e.target.name]: e.target.value}))
  }

  const {title, content} = post

  const updateCurrentPost = async() => {
    if(!title || !content) return
    await supabase
      .from('posts')
      .update([{title, content}])
      .eq('id', id)
      router.push('/my-posts')
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Edit post</h1>
      <input
        onChange={handleOnChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}>Update Post</button>
    </div>
  )
}

export default EditPost