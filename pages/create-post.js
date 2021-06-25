import { useRouter } from 'next/dist/client/router'
import {useState} from 'react'
import {v4 as uuid} from 'uuid'
import { supabase } from '../api'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"



const SimpleMDE = dynamic(() => import('react-simplemde-editor'),{ssr:false})
const initialState = {title: '', content:''}

const CreatePost = () => {
  const [post, setPost] = useState(initialState)
  const {title, content} = post
  const router = useRouter()

  const handleOnChange = (e) =>{
    setPost(() => ({...post, [e.target.name]: e.target.value}))
  }

  const createNewPost = async () => {
    if(!title || !content) return
    const user = supabase.auth.user()
    const id = uuid()
    post.id = id
    const {data} = await supabase
      .from('posts')
      .insert([{title, content, user_id: user.id,user_email:user.email}])
      .single()
    router.push(`/posts/${data.id}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input 
        onChange={handleOnChange} 
        name='title' 
        placeholder='Title' 
        value={post.value} 
        className="border-b pd-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
       <SimpleMDE
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      <button type="button" onClick={createNewPost} className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg">
        Create Post
      </button>
    </div>
  )
}

export default CreatePost