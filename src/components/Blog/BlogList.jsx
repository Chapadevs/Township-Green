import { useState, useEffect } from 'react'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAdminBlogPosts } from '../../hooks/useAdminBlogPosts'
import BlogPostForm from '../Admin/BlogPostForm'

const BlogList = () => {
  const { posts, loading, error, refetch } = useBlogPosts()
  const { isAdmin } = useAuth()
  const { refetch: refetchAdminPosts } = useAdminBlogPosts()
  const navigate = useNavigate()
  const [showBlogPostForm, setShowBlogPostForm] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return ''
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <p>Loading posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-400">
            <p>Error loading posts. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#12211a] pt-24 pb-20 px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight font-['Space_Grotesk'] mb-4">
            What's happening
          </h1>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest news and events from Top of the Green
          </p>
          {isAdmin && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowBlogPostForm(true)}
                className="bg-[#23a867] text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Create Post
              </button>
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="bg-[#1d2d25] rounded-lg shadow-2xl overflow-hidden cursor-pointer hover:bg-opacity-90 transition-all hover:scale-105"
              >
                {post.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-white text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {getExcerpt(post.content)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {formatDate(post.created_at)}
                    </span>
                    <span className="text-[#23a867] text-sm font-medium hover:text-white transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Blog Post Form Modal */}
        {showBlogPostForm && (
          <BlogPostForm
            post={null}
            onClose={() => setShowBlogPostForm(false)}
            onSuccess={async () => {
              setShowBlogPostForm(false)
              await refetch()
              await refetchAdminPosts()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default BlogList
