import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogPosts } from '../../hooks/useBlogPosts'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPostById } = useBlogPosts()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await getPostById(id)
      
      if (fetchError) {
        console.error('Error fetching post:', fetchError)
        setError(fetchError)
        setLoading(false)
        return
      }
      
      setPost(data)
      setLoading(false)
    }

    if (id) {
      fetchPost()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-400">
            <p>Post not found or error loading post.</p>
            <button
              onClick={() => navigate('/blog')}
              className="mt-4 text-[#23a867] hover:text-white transition-colors"
            >
              ← Back to blog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 text-[#23a867] hover:text-white transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to blog
        </button>

        {/* Post Content */}
        <article className="bg-[#1d2d25] rounded-lg shadow-2xl overflow-hidden">
          {post.image_url && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-['Space_Grotesk'] mb-4">
              {post.title}
            </h1>
            
            <div className="mb-6 pb-6 border-b border-[#254637]">
              <span className="text-gray-500 text-sm">
                {formatDate(post.created_at)}
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* Back Button at Bottom */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/blog')}
            className="text-[#23a867] hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to blog
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
