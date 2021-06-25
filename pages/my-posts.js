import {useState, useEffect} from 'react'
import Link from 'next/link'
import {supabase} from '../api'

export default function MyPosts  () {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  },[])

  const fetchPosts = async () => {
    const user =  supabase.auth.user()
    const {data} = await supabase
      .from('posts')
      .select('*')
      .filter('user_id', 'eq', user.id)
    setPosts(data)
  }

  const deletePosts = async (id) =>{
    await supabase.from('posts').delete().match({id})
    fetchPosts()
  }

  return (
    <div>
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-2'>My Posts</h1>
      {
        posts.map((post, index) => (
          <div key={index}>
            <h2 className="border-b border-gray-300 mt-8 pb-4">{post.title}</h2>
            <p className="text-gray-500 mt-2 mb-2">Author: {post.user_email}</p>
            <Link href={`/edit-post/${post.id}`}>
              <a className="text-sm mr-4 text-blue-500">Edit Post</a>
            </Link>
             <Link href={`/posts/${post.id}`}>
              <a className="text-sm mr-4 text-blue-500">View Post</a>
            </Link>
            <button className="text-sm mr-4 text-red-500" onClick={()=> deletePosts(post.id)}>Delete Posts</button>
          </div>
        ))
      }
    </div>
  )
}
