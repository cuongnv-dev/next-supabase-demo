import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../api'

const Post = ({post}) => {
  const router = useRouter()
  if(router.isFallback){
    return <div>Loading ...</div>
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>by {post.user_email}</p>
      <div>
        <ReactMarkdown className="prose">{post.content}</ReactMarkdown> 
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const {data, error} = await supabase
    .from('posts')
    .select('id')
  
  const paths = data.map(post => ({params: {id: JSON.stringify(post.id)}}))
  return {
    paths, fallback:true
  }
}

export const getStaticProps = async ({params}) => {
  const {id} = params
  const {data} = await supabase
    .from('posts')
    .select()
    .filter('id', 'eq', id)
    .single()

  return {
    props: {post:data}
  }
}

export default Post