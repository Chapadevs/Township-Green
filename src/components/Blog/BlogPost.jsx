import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { useBlogPostImages } from '../../hooks/useBlogPostImages'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPostById } = useBlogPosts()
  const { images: subImages, loading: imagesLoading } = useBlogPostImages(id)
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

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
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </div>
            </div>
          </div>

          {/* Sub-Images Gallery */}
          {(imagesLoading || (subImages && subImages.length > 0)) && (
            <div className="px-6 md:px-10 pb-6 md:pb-10 pt-4 md:pt-6">
              {imagesLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Loading gallery...</p>
                </div>
              ) : subImages && subImages.length > 0 ? (
                <>
                  <h3 className="text-white text-2xl md:text-3xl font-black mb-6 font-['Space_Grotesk'] tracking-tight">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subImages.map((image) => (
                      <div
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group hover:scale-105 transition-transform"
                      >
                        <img
                          src={image.image_url}
                          alt={image.alt_text || post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </article>

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || post.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedImage.alt_text && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                  <p className="text-sm break-words">{selectedImage.alt_text}</p>
                </div>
              )}
            </div>
          </div>
        )}

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
